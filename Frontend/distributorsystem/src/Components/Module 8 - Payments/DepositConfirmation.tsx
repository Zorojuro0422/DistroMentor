import { Alert, TextField, AlertTitle, Box, Button, Grid, LinearProgress, Paper, Slide, SlideProps, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from "@mui/material";
import { IOrder, PaymentRecord, IDeposit } from "../../RestCalls/Interfaces";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import logo5 from '../../Global Components/Images/logo5.png';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
function SlideTransitionDown(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

const ContentNameTypography = styled(Typography)({
  marginTop: 40,
  marginLeft: -620,
  fontFamily: 'Inter',
  fontWeight: 'bold',
  textAlign: 'left',
  fontSize: '25px',
  color: '#203949',
  '@media(max-width:900px)': {
    fontSize: '17px',
    marginLeft: -12,
  },
});

const StyledButton = styled(Button)({
  marginTop: -5,
  marginLeft: 20,
  backgroundColor: '#2C85E7',
  fontFamily: 'Inter',
  fontSize: '15px',
  width: '50px',
  height: 40,
  ':hover': {
    backgroundColor: '#2C85E7',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.4s',
});

const StyledPrintDiv = styled('div')({
  paddingTop: 40,
  marginLeft: -500,
  '& Button': {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Inter',
    width: '50px',
    height: 40,
    marginLeft: 10,
    ':hover': {
      backgroundColor: '#2C85E7',
      transform: 'scale(1.1)',
    },
    transition: 'all 0.4s',
    '@media(max-width:900px)': {
      height: 40,
      marginLeft: 350,
    },
  },

 // Print-specific styles using the @media print query
  '@media print': {
    '& Button': {
      display: 'none', // Hide buttons during print
    },
    '.no-print': {
      display: 'none', // Hide elements with this class during print
    },
    '@page': {
      size: 'landscape',
    },
  },
});

const StyldeInfoHeader = styled(Typography)({
  marginTop: '40px',
  marginBottom: '90px',
  marginLeft: '10%',
  fontFamily: 'Inter',
  fontWeight: 'bold',
  textAlign: 'left',
  fontSize: '20px',
  color: '#203949',
});

const StackStyle = styled(Stack)({
  position: 'absolute',
  top: '230px',
  left: '-12%',
  fontFamily: 'Inter',
});

const StyleLabel = styled(Typography)({
  textAlign: 'left',
  fontWeight: '550',
  paddingTop: 80,
  marginLeft: 195,
  color: '#707070',
  fontSize: '15px',
  width: 'max-content',
  fontFamily: 'Inter',
});

const StyleData = styled(Typography)({
  textAlign: 'left',
  width: 250,
  marginLeft: 210,
  marginTop: 10,
  color: '#203949',
  fontSize: '15px',
  fontFamily: 'Inter, sans-serif',
});

const StyleTotalLabel = styled(Typography)({
  position: 'absolute',
  textAlign: 'left',
  fontWeight: '550',
  top: '30px',
  left: '798px',
  color: '#707070',
  fontSize: '20px',
  width: 'max-content',
  fontFamily: 'Inter',
  alignItems: 'end',
});

const StyleTotalData = styled(Typography)({
  position: 'absolute',
  textAlign: 'center',
  left: '33px',
  top: '1px',
  color: '#203949',
  fontSize: '20px',
  fontWeight: '250',
  fontFamily: 'Inter',
});

const StyleTotalPaper = styled(Paper)({
  backgroundColor: '#ffffff',
  border: 'light',
  borderRadius: '20px',
  position: 'absolute',
  width: '150px',
  height: '35px',
  left: '1050px',
  top: 25,
});

const TableHeaderCell = styled(TableCell)({
  fontSize: 15,
  color: "#707070",
  fontWeight: "bold",
  textAlign: 'center',
});

const StyleLabelData = styled(Typography)({
  position: 'absolute',
  textAlign: 'left',
  fontWeight: '550',
  paddingTop: 70,
  marginLeft: -870,
  color: '#203949',
  fontSize: '20px',
  width: 'max-content',
  fontFamily: 'Inter',
});

const PaperStyle = styled(Paper)({
  background: 'linear-gradient(50deg, rgba(255,255,255,0.4) 12%,rgba(255,255,255,0.1) 77%)',
  backdropFilter: 'blur(5px)',
  WebkitBackdropFilter: 'blur(5px)',
  boxShadow: '0 3px 3px 1px rgba(0,0,0,0.28)',
  borderRadius: "10px",
  backgroundColor: '#ffffff',
  width: '1200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  margin: '100px 0px 0px 90px',
  '@media print': {
          margin: '10px 0px 0px 30px',
          width: 'auto',
          pageBreakInside: 'avoid', // Prevent page break inside this element
      }
});

export default function DepositConfirmation() {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alerttitle, setTitle] = useState('');
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [openDialog, setOpenDialog] = useState(false); // Dialog open state
  const { objectId } = useParams();
  const [proofOfRemittanceFiles, setProofOfRemittanceFiles] = useState<Record<string, File | null>>({});
  const [deposit, setDeposit] = useState<IDeposit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState<string>("");
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchDepositById = async (id: string) => {
      try {
        console.log("Fetching deposit data for ID:", id); // Log the ID being fetched
        const response = await axios.get<IDeposit>(`http://distromentor.onrender.com/api/deposits/${id}`);
        setDeposit(response.data);
        console.log("Fetched deposit data successfully:", response.data); // Log the fetched data
      } catch (error) {
        console.error("Error fetching deposit:", error); // Log the error
        setError("Failed to load deposit data.");
      } finally {
        setIsLoading(false);
        console.log("Fetch deposit data process completed."); // Log the completion of fetch process
      }
    };

    if (objectId) {
      console.log("Object ID exists, proceeding to fetch data:", objectId); // Log that objectId exists
      fetchDepositById(objectId);
    } else {
      console.log("Object ID is not available."); // Log if objectId is not available
    }
  }, [objectId]);

  useEffect(() => {
    if (deposit && deposit.orderid) {
      console.log("Fetching order data for order ID:", deposit.orderid); // Log the order ID being fetched
      axios
        .get<IOrder>(`http://distromentor.onrender.com/order/getOrderByID/${deposit.orderid}`)
        .then((response) => {
          setOrder(response.data);
          console.log("Fetched order data successfully:", response.data); // Log the fetched order data
        })
        .catch((error) => {
          console.error("Error fetching order data:", error); // Log the error
          headerHandleAlert('Error', "Failed to retrieve order data. Please try again.", 'error');
        });
    } else {
      console.log("No order ID available in deposit data."); // Log if orderid is not available
    }
  }, [deposit]); // Dependency on `deposit` ensures it runs when `deposit` updates

  const fetchPaymentRecords = () => {
    if (!deposit || !deposit.orderid) {
      console.error("No deposit or order ID available to fetch payment records.");
      return;
    }

    axios
      .get(`http://distromentor.onrender.com/payment-records/order/${deposit.orderid}`)
      .then((response) => {
        console.log("Fetched Payment Records:", response.data); // Log the fetched data
        setPaymentRecords(response.data); // Store the fetched data
      })
      .catch((error) => {
        console.error("Error fetching payment records:", error); // Log the error
      });
  };

  const handleOpenDialog = () => {
      fetchPaymentRecords(); // Fetch payment data when the dialog opens
      setOpenDialog(true);
    };

  const handleCloseDialog = () => {
      setOpenDialog(false);
  };

  const headerHandleAlert = (title: string, message: string, severity: 'success' | 'warning' | 'error') => {
    setTitle(title);
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpenAlert(true);
  };

  const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const [printing, setPrinting] = useState(false);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 10);
  };

  const handlePayWithProof = async (record: PaymentRecord) => {
    try {
      console.log("Pay button clicked for record:", record);

      // Extract dealer ID, distributor ID, and order ID safely
      const dealerId = order?.dealer?.dealerid; // Safely get dealer ID
      const distributorId = order?.distributor?.distributorid; // Safely get distributor ID
      const orderId = order?.orderid; // Safely get order ID
      const paymentDate = moment().format("YYYY-MM-DDTHH:mm:ss"); // Current date and time
      const proofOfRemittance = proofOfRemittanceFiles[record.paymentId]; // Get the selected file for proof of remittance
      // Validate required fields
      if (!dealerId || !distributorId || !orderId || !record.paymentId || !proofOfRemittance) {
        headerHandleAlert(
          "Error",
          "Missing required information or proof of remittance.",
          "error"
        );
        console.error("Missing information:", {
          dealerId,
          distributorId,
          orderId,
          paymentId: record.paymentId,
          proofOfRemittance,
        });
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("dealerId", dealerId);
      formData.append("distributorId", distributorId);
      formData.append("orderId", orderId); // Pass the order ID correctly
      formData.append("paymentId", record.paymentId);
      formData.append("amount", record.amount.toString());
      formData.append("transactionNumber", `TXN-${record.paymentId}`);
      formData.append("paymentDate", paymentDate);
      formData.append("proofOfRemittance", proofOfRemittance);

      // Make API request
      const response = await axios.post(
        "http://distromentor.onrender.com/api/deposits/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);

       // If deposit creation is successful, update the payment record status to Pending
          const updateResponse = await axios.put(
            `http://distromentor.onrender.com/payment-records/${record.paymentId}`,
            {
              ...record,
              status: "Pending", // Change the status to Pending
            }
          );

          console.log("Payment Record Updated:", updateResponse.data);

      headerHandleAlert(
        "Success",
        `Deposit for Payment ID ${record.paymentId} created successfully!`,
        "success"
      );

    } catch (error) {
      console.error("Error creating deposit:", error);
      headerHandleAlert(
        "Error",
        `Failed to create deposit for Payment ID ${record.paymentId}.`,
        "error"
      );
    }
  };

const handleSnackbarClose = () => {
  setSnackbarOpen(false);
};

    const handleConfirm = async () => {
      if (!deposit || !deposit.orderid || !deposit.paymentid) {
        setSnackbarMessage("Order ID or Payment ID is missing in the deposit data.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      try {
        // Confirm deposit in the backend
        await axios.patch(`http://distromentor.onrender.com/api/deposits/confirm/${objectId}`);

        // Fetch the latest order data
        const orderResponse = await axios.get(
          `http://distromentor.onrender.com/order/getOrderByID/${deposit.orderid}`
        );
        const order = orderResponse.data;

        if (!order) {
          setSnackbarMessage("Order not found.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        // Update the deposit amount and determine the updated status
        const updatedDeposit = (order.deposit || 0) + deposit.amount; // Add deposit amount to the existing deposit
        const updatedStatus = updatedDeposit === order.orderamount ? "Closed" : "Pending"; // Determine the new status

        // Update the order object with the new deposit and status
        const updatedOrder = { ...order, deposit: updatedDeposit, status: updatedStatus };
        console.log("Updated Order Object:", updatedOrder);

        // Send the update request for the order
        await axios.put(
          `http://distromentor.onrender.com/order/updateOrder/${deposit.orderid}`,
          updatedOrder
        );

        // Update the specific payment record to "Paid"
        const updateResponse = await axios.put(
          `http://distromentor.onrender.com/payment-records/${deposit.paymentid}`,
          {
            ...deposit, // Spread all existing data from the `deposit`
            status: "Paid", // Update only the `status` field
          }
        );

        console.log("Payment Record Updated:", updateResponse.data);

        const dealerId = order.dealer?.dealerid;

                if (!dealerId) {
                  console.error("Dealer ID is missing!");
                  return;
                }

                try {
                  // Log the dealer ID
                  console.log("Fetching totalProductSubtotal for dealerId:", dealerId);

                  // Fetch the current totalProductSubtotal
                  const response = await axios.get(
                    `http://distromentor.onrender.com/allProductSubtotals/getByDealerId/${deposit.dealerid}`
                  );

                  // Log the fetched response
                  console.log("Response from getByDealerId API:", response.data);

                  const totalProductSubtotal = response.data.totalProductSubtotal;

                  // Log the current totalProductSubtotal
                  console.log("Current totalProductSubtotal:", totalProductSubtotal);

                  const updatedTotalDebt = totalProductSubtotal - deposit.amount;

                  // Log the updated totalProductSubtotal
                  console.log("Updated totalProductSubtotal after deduction:", updatedTotalDebt);

                  // Update the allProductSubtotals in the backend
                  const updateResponse = await axios.put(
                    `http://distromentor.onrender.com/allProductSubtotals/updateByDealerId/${deposit.dealerid}`,
                    {
                      totalProductSubtotal: updatedTotalDebt, // Updated total debt (subtotal)
                    }
                  );

                  // Log the response from the update API
                  console.log("Response from updateByDealerId API:", updateResponse.data);

                  console.log("Updated totalProductSubtotal successfully:", updatedTotalDebt);
                } catch (error) {
                  console.error("Error occurred while fetching or updating totalProductSubtotal:", error);
                }

        // Refetch the updated order data to ensure UI is in sync
        const updatedOrderResponse = await axios.get(
          `http://distromentor.onrender.com/order/getOrderByID/${deposit.orderid}`
        );
        console.log("Updated Order from Backend:", updatedOrderResponse.data);

        setSnackbarMessage("Deposit confirmed, order and payment record updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        navigate("/depositReceipt", {
              state: { tab: "Confirmed Deposits" }, // Pass state to pre-select the Confirmed tab
            }); // Navigate back after confirmation
      } catch (error) {
        console.error("Error confirming deposit or updating order:", error);

        if (axios.isAxiosError(error) && error.response) {
          setSnackbarMessage(
            `Error: ${error.response.data.message || "Failed to confirm deposit or update order."}`
          );
        } else {
          setSnackbarMessage("An unexpected error occurred. Please try again.");
        }

        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    const handleDecline = async () => {
        try {
          await axios.patch(`http://distromentor.onrender.com/api/deposits/decline/${objectId}`, null, {
            params: { reason: declineReason },
          });
          alert("Deposit declined.");
          setIsDeclineDialogOpen(false);
          navigate("/decline"); // Navigate back after declining
        } catch (error) {
          console.error("Error declining deposit:", error);
          alert("Failed to decline deposit.");
        }
      };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    paymentId: string
  ) => {
    const file = event.target.files?.[0] || null;
    console.log("Selected file for Payment ID:", paymentId, file);
    setProofOfRemittanceFiles((prev) => ({
      ...prev,
      [paymentId]: file, // Store the file against the corresponding paymentId
    }));
  };

  return (
    <div>
        <div>
          {order ? (
            <div>
              <Grid container style={{ position: 'relative', justifyContent: "center", alignItems: "center" }}>
                <Grid>
                  <div style={{ display: "flex", flexDirection: 'row', paddingTop: 7, paddingLeft: 20 }}>
                    <Grid item>
                      <ContentNameTypography>Deposit Transaction Details</ContentNameTypography>
                    </Grid>
                  </div>
                </Grid>
                <Grid container style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                  <StyleLabelData style={{ paddingTop: 75, marginLeft: -890 }}>Deposit Information</StyleLabelData>
                </Grid>
                <Grid container style={{ position: 'relative', justifyContent: "center", alignItems: "center" }}>
                  <Grid item>
                    <StyleLabel style={{ marginLeft: 120 }}>Transaction Number</StyleLabel>
                    <StyleData style={{ marginLeft: 130 }}>
                      {deposit?.transactionnumber || "N/A"}
                    </StyleData>
                  </Grid>

                  <Grid item>
                      <StyleLabel style={{ marginLeft: 10 }}>Dealer Name</StyleLabel>
                      <StyleData style={{ marginLeft: 10 }}>{order?.dealer.firstname} {order?.dealer.middlename} {order?.dealer.lastname}</StyleData>
                    </Grid>

                  <Grid item>
                    <StyleLabel style={{ marginLeft: -85 }}>Deposit Amount</StyleLabel>
                    <StyleData style={{ marginLeft: -70 }}>
                      ₱{deposit?.amount?.toFixed(2) || "N/A"}
                    </StyleData>
                  </Grid>

                  <Grid item>
                    <StyleLabel style={{ marginLeft: -70 }}>Submission Date</StyleLabel>
                    <StyleData style={{ marginLeft: -50 }}>
                      {deposit?.submissionDate
                        ? moment(deposit.submissionDate).format("YYYY-MM-DD")
                        : "N/A"}
                    </StyleData>
                  </Grid>
                  <Grid item>
                    <StyleLabel style={{ marginLeft: -90 }}>Proof of Payment</StyleLabel>
                    <StyleData style={{ marginLeft: -95 }}>
                      {deposit?.proofOfRemittance ? (
                        <Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => window.open(`http://distromentor.onrender.com${deposit.proofOfRemittance}`, "_blank")}
                            sx={{
                              marginTop: "0px",
                              fontSize: "14px",
                              padding: "3px 8px", // Smaller padding for reduced height
                              height: "20px", // Explicitly set a smaller height
                              minWidth: "100px", // Optional: Set a minimum width for consistency
                            }}
                          >
                            View Full Image
                          </Button>
                        </Box>
                      ) : (
                        "No Proof of Payment Available"
                      )}
                    </StyleData>
                  </Grid>
                     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "16px" }}>
                       {/* Remaining Balance */}
                       <div style={{ textAlign: "center", marginRight: "16px" }}>
                         <StyleLabel style={{ whiteSpace: "nowrap", marginRight: "8px" }}>Remaining Balance:</StyleLabel>
                         <StyleData style={{ whiteSpace: "nowrap", fontWeight: "bold", color: "red" }}>
                           ₱
                           {order && deposit
                             ? (order.orderamount - order.deposit).toFixed(2) // Calculate remaining balance
                             : "N/A"}
                         </StyleData>
                       </div>

                       {/* Order Status */}
                       <div style={{ textAlign: "center", marginLeft: "-200px" }}>
                         <StyleLabel style={{ whiteSpace: "nowrap", marginRight: "8px" }}>Order Status:</StyleLabel>
                         <StyleData
                             style={{
                               whiteSpace: "nowrap",
                               fontWeight: "bold", // Make the text bold
                               color:
                                 order?.status === "Open"
                                   ? "green" // Green for "Open"
                                   : order?.status === "Pending"
                                   ? "orange" // Orange for "Pending"
                                   : order?.status === "Closed"
                                   ? "red" // Red for "Closed"
                                   : "inherit", // Default color for other statuses
                             }}
                           >
                             {order?.status || "N/A"}
                           </StyleData>
                       </div>
                     </div>


                </Grid>
                <Grid container style={{ position: 'relative', justifyContent: "center", alignItems: "center" }}>
                  <StyleLabelData style={{ paddingTop: 100, marginLeft: -890 }}>Order Breakdown</StyleLabelData>
                </Grid>
                <Grid container style={{ position: 'relative', justifyContent: "center", alignItems: "center" }}>
                  <PaperStyle>
                    <TableContainer>
                      <Table aria-label='simple table'>
                        <TableHead style={{ backgroundColor: 'rgb(45, 133, 231, 0.08)' }}>
                          <TableRow>
                            <TableHeaderCell align="center" sx={{ color: '#707070' }}>Quantity</TableHeaderCell>
                            <TableHeaderCell align="center" sx={{ color: '#707070' }}>Unit</TableHeaderCell>
                            <TableHeaderCell align="center" sx={{ color: '#707070' }}>Product Name</TableHeaderCell>
                            <TableHeaderCell align="center" sx={{ color: '#707070' }}>Unit Price</TableHeaderCell>
                            <TableHeaderCell align="center" sx={{ color: '#707070' }}>Amount</TableHeaderCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order?.orderedproducts.map((op, index) => (
                            <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? 'inherit' : 'rgb(45, 133, 231, 0.08)' }}>
                              <TableCell align='center'>{op.quantity}</TableCell>
                              <TableCell align='center'>{op.product.unit}</TableCell>
                              <TableCell align='center'>{op.product.name}</TableCell>
                              <TableCell align='center'>{op.product.price}</TableCell>
                              <TableCell align='center'>{op.product.price * op.quantity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Grid container style={{ position: 'relative', justifyContent: "center", alignItems: "center" }}>
                      <Grid item>
                        <StyleTotalLabel>Total Ordered Amount:</StyleTotalLabel>
                      </Grid>
                      <Grid item>
                        <StyleTotalPaper>
                          <StyleTotalData>₱ {order?.orderamount}</StyleTotalData>
                        </StyleTotalPaper>
                      </Grid>
                    </Grid>
                  </PaperStyle>

                  <Box
                    sx={{
                      position: "absolute", // Position it relative to the parent container
                      bottom: "-100px", // Adjust distance from the bottom
                      left: "50%", // Center it horizontally
                      transform: "translateX(-50%)", // Offset the centering
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <StyledButton
                      onClick={handleConfirm}
                      sx={{
                        marginRight: "20px",
                        backgroundColor: "#4CAF50",
                        color: "white", // White text
                        minWidth: "150px", // Ensure enough width
                        padding: "10px 20px", // Add spacing
                        ":hover": { backgroundColor: "#45A049" },
                      }}
                    >
                      Confirm
                    </StyledButton>
                    <StyledButton
                      onClick={() => setIsDeclineDialogOpen(true)}
                      sx={{
                        backgroundColor: "red",
                        color: "white", // White text
                        minWidth: "150px", // Ensure enough width
                        padding: "10px 20px", // Add spacing
                        ":hover": { backgroundColor: "#e53935" },
                      }}
                    >
                      Decline
                    </StyledButton>
                  </Box>



                  <Grid
                    container
                    sx={{
                      position: "fixed", // Fix the container to the viewport
                      top: 100, // Distance from the top of the page
                      right: 40, // Distance from the right of the page
                      justifyContent: "flex-end", // Align items to the right
                      alignItems: "center", // Align items vertically in the center
                      padding: "10px", // Add some padding for spacing
                      width: "auto", // Automatically size the container based on content
                      maxWidth: "300px", // Optionally, set a max width for the container
                    }}
                  >
                    <Grid item>
                      <StyledButton
                        variant="contained"
                        onClick={handleOpenDialog}
                        sx={{
                          padding: "8px 16px", // Adjust padding for better responsiveness
                          minWidth: "200px", // Set a minimum width for consistent size
                          fontSize: "14px", // Adjust font size for readability
                        }}
                      >
                        View Payment
                      </StyledButton>
                    </Grid>
                  </Grid>



                  <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: "bold" }}>Payment Records</DialogTitle>
                    <DialogContent>
                      {paymentRecords ? (
                        <div>
                          {paymentRecords.map((record, index) => (
                            <div
                              key={index}
                              style={{
                                marginBottom: "16px",
                                padding: "8px",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                              }}
                            >
                              <Typography>Amount: ₱ {record.amount}</Typography>

                              {/* Conditionally render Due Date */}
                              {record.status !== "Paid" && (
                                <Typography>Due Date: {record.dueDate}</Typography>
                              )}

                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginTop: "8px",
                                }}
                              >
                                <Typography>
                                  Status:{" "}
                                  <span
                                    style={{
                                      color:
                                        record.status === "Pending"
                                          ? "orange"
                                          : record.status === "Paid" || record.status === "Overdue"
                                          ? "red"
                                          : record.status === "Open"
                                          ? "green"
                                          : "inherit",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {record.status}
                                  </span>
                                </Typography>
                              </Box>

                              {/* File upload for proof of remittance */}
                              <Box
                                sx={{
                                  marginTop: "8px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "8px",
                                }}
                              >

                              </Box>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Typography>Loading payment records...</Typography>
                      )}
                    </DialogContent>

                    <DialogActions>
                      <Button onClick={handleCloseDialog} sx={{ color: "red", fontWeight: "bold" }}>
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Dialog open={isDeclineDialogOpen} onClose={() => setIsDeclineDialogOpen(false)}>
                          <DialogTitle>Decline Deposit</DialogTitle>
                          <DialogContent>
                            <TextField
                              autoFocus
                              margin="dense"
                              label="Reason for Decline"
                              fullWidth
                              value={declineReason}
                              onChange={(e) => setDeclineReason(e.target.value)}
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setIsDeclineDialogOpen(false)} color="primary">
                              Cancel
                            </Button>
                            <Button onClick={handleDecline} color="secondary">
                              Decline
                            </Button>
                          </DialogActions>
                        </Dialog>

                  {/* Alerts */}
                  <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }} TransitionComponent={SlideTransitionDown}>
                    <Alert onClose={handleCloseAlert} severity={alertSeverity as 'success' | 'warning' | 'error'} sx={{ width: 500 }}>
                      <AlertTitle style={{ textAlign: 'left', fontWeight: 'bold' }}>{alerttitle}</AlertTitle>
                      {alertMessage}
                    </Alert>
                  </Snackbar>
                </Grid>
              </Grid>
            </div>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh', marginTop: '-20px' }}>
              <img src={logo5} alt="Logo" style={{ width: '375px' }} />
              <LinearProgress sx={{ width: '20%' }} />
            </Box>
          )}
        </div>
    </div>
  );
}
