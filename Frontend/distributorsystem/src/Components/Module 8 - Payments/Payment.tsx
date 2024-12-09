import { useEffect, useState } from "react";
import { IOrder } from "../../RestCalls/Interfaces";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CircularProgress,
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
  "& .MuiDataGrid-row:nth-of-type(even)": {
    backgroundColor: "rgb(45, 133, 231, 0.1)",
  },
});

export default function Payment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState("Open");
  const [openOrders, setOpenOrders] = useState<IOrder[]>([]);
  const [closeOrders, setCloseOrders] = useState<IOrder[]>([]);
  const userFromStorage = JSON.parse(localStorage.getItem("user")!);

  const toggleTables = (value: string) => setTabValue(value);

  useEffect(() => {
      const fetchOrdersByDealer = async () => {
        try {
          console.log("Fetching confirmed orders for dealer ID:", userFromStorage.userId);

          const response = await axios.get<IOrder[]>(
            `http://localhost:8080/order/getAllConfirmedOrdersByDealerId/${userFromStorage.userId}`
          );

          console.log("Fetched Orders:", response.data);

          // Split orders into "open" (unpaid) and "close" (paid)
          setOpenOrders(response.data.filter((order) => order.status === "Open" || order.status === "Pending")); // Unpaid
          setCloseOrders(response.data.filter((order) => order.status === "Closed")); // Paid
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching orders:", error);
          setIsLoading(false);
        }
      };

      fetchOrdersByDealer();
    }, [userFromStorage.userId]);

  const mapRows = (orders: IOrder[]) =>
      orders.map((order) => ({
        id: order.orderid,
        date: moment(order.orderdate).format("YYYY-MM-DD"),
        amount: `₱${order.orderamount.toFixed(2)}`,
        status: order.status, // Add the status field
  }));

  const columns: GridColDef[] = [
      { field: "id", headerName: "Order ID", width: 150 },
      { field: "date", headerName: "Order Date", width: 200 },
      { field: "amount", headerName: "Amount", width: 150 },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        renderCell: (params) => (
          <span
            style={{
              color:
                params.row.status === "Open"
                  ? "green"
                  : params.row.status === "Pending"
                  ? "orange"
                  : "red",
              fontWeight: "bold",
            }}
          >
            {params.row.status}
          </span>
        ),
      },
    {
      field: "view",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <StyledButton onClick={() => navigate(`/orderTransactionDetails/${params.row.id}`)}>View</StyledButton>
      ),
    },
  ];

  return (
    <div>
      <StyledCard>
        <Box sx={{ width: "100%", marginTop: 4, marginLeft: 0.5 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={(e, val) => toggleTables(val)} style={{ marginLeft: 40 }}>
              <TabStyle label="Unpaid Order" value="Open" />
              <TabStyle label="Paid Order" value="Closed" />
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
                rows={tabValue === "Open" ? mapRows(openOrders) : mapRows(closeOrders)}
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
    </div>
  );
}
