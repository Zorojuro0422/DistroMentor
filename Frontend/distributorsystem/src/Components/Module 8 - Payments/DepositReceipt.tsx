import { useEffect, useState } from "react";
import { IDeposit, IDealer } from "../../RestCalls/Interfaces";
import axios from "axios";
import { GridRenderCellParams } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  styled,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import moment from "moment";

// Styled Components
const StyledCard = styled(Card)({
  padding: "10px 10px 10px 2px",
  margin: "50px 28% 0px 7.2%",
  width: "90%",
  height: "550px",
  background: "linear-gradient(50deg, rgba(255,255,255,0.4) 12%,rgba(255,255,255,0.1) 77%)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  boxShadow: "0 4px 7px 1px rgba(0,0,0,0.28)",
  alignItems: "center",
  borderRadius: "10px",
  justifyContent: "center",
  position: "fixed",
});

const StyledButton = styled(Button)({
  backgroundColor: "rgb(45, 133, 231,0.8)",
  borderRadius: 20,
  color: "#FFFFFF",
  fontFamily: "Inter, sans-serif",
  fontSize: "15px",
  width: "100px",
  height: 35,
  ":hover": {
    backgroundColor: "#2D85E7",
    transform: "scale(1.1)",
  },
  transition: "all 0.4s",
});

const TabStyle = styled(Tab)({
  width: 320,
  fontWeight: "550",
});

const DataGridStyle = styled(DataGrid)({
  textAlign: "center",
  fontSize: 15,
  color: "#203949",
  height: "420px",
  width: "100%",
  margin: "10px 10px 0px 0px",
  borderRadius: "5px",
  border: "0px solid #e0e0e0",
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "rgb(45, 133, 231, 0.2)",
    fontWeight: "bold",
  },
  "& .MuiDataGrid-row:nth-child(even)": {
    backgroundColor: "rgb(45, 133, 231, 0.1)",
  },
});

export default function PaymentsListUI() {
  const navigate = useNavigate();
  const [unconfirmedDeposits, setUnconfirmedDeposits] = useState<IDeposit[]>([]);
  const [confirmedDeposits, setConfirmedDeposits] = useState<IDeposit[]>([]);
  const [declinedDeposits, setDeclinedDeposits] = useState<IDeposit[]>([]);
  const [dealers, setDealers] = useState<Record<string, IDealer>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState("unconfirmed");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [depositIdToDelete, setDepositIdToDelete] = useState<string | null>(null);

  const userFromStorage = JSON.parse(localStorage.getItem("user")!);

  const toggleTables = (value: string) => setTabValue(value);

  const fetchDealerById = async (dealerId: string) => {
    try {
      const response = await axios.get<IDealer>(`http://localhost:8080/dealer/getDealerByID/${dealerId}`);
      setDealers((prev) => ({ ...prev, [dealerId]: response.data }));
    } catch (error) {
      console.error(`Error fetching dealer ${dealerId}:`, error);
    }
  };

  const getAllDeposits = (url: string, setState: React.Dispatch<React.SetStateAction<IDeposit[]>>) => {
    axios
      .get<IDeposit[]>(url)
      .then((response) => {
        setState(response.data);
        response.data.forEach((deposit) => {
          if (!dealers[deposit.dealerid]) fetchDealerById(deposit.dealerid);
        });
      })
      .catch((error) => console.error(`Error fetching deposits from ${url}:`, error))
      .finally(() => setIsLoading(false));
  };

  const handleViewButtonClick = (id: string) => navigate(`/depositDetails/${id}`);

  const handleDeleteClick = (id: string) => {
    setDepositIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (depositIdToDelete) {
        await axios.delete(`http://localhost:8080/api/deposits/${depositIdToDelete}`);
        setConfirmedDeposits((prev) => prev.filter((d) => d.depositid !== depositIdToDelete));
        setDeclinedDeposits((prev) => prev.filter((d) => d.depositid !== depositIdToDelete));
        setDeleteDialogOpen(false);
        alert("Deposit deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting deposit:", error);
      alert("Failed to delete deposit.");
    }
  };

  const mapRows = (deposits: IDeposit[]) =>
    deposits.map((deposit) => ({
      id: deposit.depositid,
      dealerName: `${dealers[deposit.dealerid]?.firstname || ""} ${dealers[deposit.dealerid]?.lastname || ""}`,
      transactionnumber: deposit.transactionnumber,
      amount: `₱${deposit.amount.toFixed(2)}`, // Add peso sign to amount
      submissionDate: moment(deposit.submissionDate).format("YYYY-MM-DD"),
      declineReason: deposit.declineReason || "N/A", // Add decline reason if available
    }));

  const columns: GridColDef[] = [
    { field: "dealerName", headerName: "Dealer Name", width: 200 },
    { field: "transactionnumber", headerName: "Transaction Number", width: 250 },
    { field: "amount", headerName: "Amount", width: 150 },
    { field: "submissionDate", headerName: "Submission Date", width: 200 },
    ...(tabValue === "declined"
      ? [
          {
            field: "declineReason",
            headerName: "Reason for Decline",
            width: 200,
          },
        ]
      : []),
    {
      field: "view",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <StyledButton onClick={() => handleViewButtonClick(params.row.id)}>View</StyledButton>
      ),
    },
    ...(tabValue === "confirmed" || tabValue === "declined"
      ? [
          {
            field: "delete",
            headerName: "",
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
              <StyledButton
                onClick={() => handleDeleteClick(params.row.id)}
                sx={{ backgroundColor: "red", ":hover": { backgroundColor: "#e53935" } }}
              >
                Delete
              </StyledButton>
            ),
          },
        ]
      : []),
  ];

  useEffect(() => {
      getAllDeposits(
        `http://localhost:8080/api/deposits/unconfirmed/distributor/${userFromStorage.distributor.distributorid}`,
        setUnconfirmedDeposits
      );
      getAllDeposits(
        `http://localhost:8080/api/deposits/confirmed/distributor/${userFromStorage.distributor.distributorid}`,
        setConfirmedDeposits
      );
      getAllDeposits(
        `http://localhost:8080/api/deposits/declined/distributor/${userFromStorage.distributor.distributorid}`,
        setDeclinedDeposits
      );
    }, []);

  return (
    <div>
      <StyledCard>
        <Box sx={{ width: "100%", marginTop: 4, marginLeft: 0.5 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={(e, val) => toggleTables(val)} style={{ marginLeft: 40 }}>
              <TabStyle label="Unconfirmed Deposits" value="unconfirmed" />
              <TabStyle label="Confirmed Deposits" value="confirmed" />
              <TabStyle label="Declined Deposits" value="declined" />
            </Tabs>
          </Box>
          <Box sx={{ p: 2 }}>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  marginTop: "200px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <DataGridStyle
                rows={
                  tabValue === "unconfirmed"
                    ? mapRows(unconfirmedDeposits)
                    : tabValue === "confirmed"
                    ? mapRows(confirmedDeposits)
                    : mapRows(declinedDeposits)
                }
                columns={columns}
                getRowId={(row) => row.id}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[10]}
              />
            )}
          </Box>
        </Box>
      </StyledCard>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>Are you sure you want to delete this deposit?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
