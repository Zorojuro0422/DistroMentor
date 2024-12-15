import { Alert, AlertTitle, Box, Button, Grid, LinearProgress, Paper, Slide, SlideProps, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from "@mui/material";
import { IOrder, PaymentRecord } from "../../RestCalls/Interfaces";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import OrderTransactionDetailsPrint from "./OrderTransactionDetailsPrint";
import logo5 from '../../Global Components/Images/logo5.png';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import moment from "moment";
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

export function OrderTransactionDetails() {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alerttitle, setTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [openDialog, setOpenDialog] = useState(false); // Dialog open state
  const { objectId } = useParams();
  const [proofOfRemittanceFiles, setProofOfRemittanceFiles] = useState<Record<string, File | null>>({});

  const user = JSON.parse(localStorage.getItem('user')!) || {};


  useEffect(() => {
    axios
      .get<IOrder>(`https://distromentor.onrender.com/order/getOrderByID/${objectId}`)
      .then((response) => {
        const orderData = response.data;
        console.log("Fetched Order Data:", orderData); // Log the entire order data

        setOrder(orderData); // Set the state with the fetched order data
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
        headerHandleAlert('Error', "Failed to retrieve order data. Please try again.", 'error');
      });
  }, [objectId]);

  const fetchPaymentRecords = () => {
    axios
      .get(`https://distromentor.onrender.com/payment-records/order/${objectId}`)
      .then((response) => {
        console.log("Fetched Payment Records:", response.data); // Log the fetched data
        setPaymentRecords(response.data); // Store the fetched data
      })
      .catch((error) => {
        console.error("Error fetching payment records:", error);
        headerHandleAlert("Error", "Failed to retrieve payment records. Please try again.", "error");
      });
  };

  const handleOpenDialog = () => {
      fetchPaymentRecords(); // Fetch payment data when the dialog opens
      setOpenDialog(true);
    };

  const handlePay = (record: PaymentRecord) => {
    console.log(`Processing payment for Record ID: ${record.paymentId}`);
    // Add your payment logic here
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
        "https://distromentor.onrender.com/api/deposits/create",
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
            `https://distromentor.onrender.com/payment-records/${record.paymentId}`,
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

const handleOverduePayments = async () => {
  try {
    const currentDate = moment().startOf('day');
    console.log("Current Date:", currentDate.format('YYYY-MM-DD')); // Log the current date

    // Fetch order details if not available
    console.log("Fetching order details for object ID:", objectId);
    const orderResponse = await axios.get<IOrder>(
      `https://distromentor.onrender.com/order/getOrderByID/${objectId}`
    );
    const order = orderResponse.data;
    console.log("Fetched Order Details:", order);

    // Extract dealerId from the order
    const dealerId = order?.dealer?.dealerid;
    console.log("Dealer ID:", dealerId);

    if (!dealerId) {
      console.error("Dealer ID not found in the order data.");
      return; // Exit if dealerId is not available
    }

    // Fetch payment records
    console.log("Fetching payment records for order ID:", objectId);
    const response = await axios.get<PaymentRecord[]>(
      `https://distromentor.onrender.com/payment-records/order/${objectId}`
    );
    const paymentRecords = response.data;
    console.log("Fetched Payment Records:", paymentRecords);

    // Loop through payment records and check for overdue payments
    for (const record of paymentRecords) {
      console.log("Processing payment record:", record);

      if (
        record.status === "Open" &&
        moment(record.dueDate).isBefore(currentDate)
      ) {
        console.log(
          `Payment record ${record.paymentId} is overdue. Status: ${record.status}, Due Date: ${record.dueDate}`
        );

        // Change status to "Overdue"
        const updatedRecord = { ...record, status: "Overdue" };
        console.log("Updating payment record status to 'Overdue':", updatedRecord);

        await axios.put(
          `https://distromentor.onrender.com/payment-records/${record.paymentId}`,
          updatedRecord
        );
        console.log(`Updated payment record ${record.paymentId} to 'Overdue'`);

        // Calculate penalty (10% of the overdue amount)
        const penalty = record.amount * 0.1;
        console.log(`Penalty calculated for payment ID ${record.paymentId}: ₱${penalty}`);

        await axios.post(
          `https://distromentor.onrender.com/api/total-interest/${dealerId}?interest=${penalty}`
        );
        console.log(`Penalty of ₱${penalty} recorded in Total Interest for dealer ${dealerId}`);

        // Deduct penalty from dealer's credit limit
        console.log("Fetching dealer details for dealer ID:", dealerId);
        const dealerResponse = await axios.get(
          `https://distromentor.onrender.com/dealer/getDealerByID/${dealerId}`
        );
        const dealer = dealerResponse.data;
        console.log("Fetched Dealer Details:", dealer);
        const creditLimit = dealer?.creditlimit;
        console.log("Dealer Credit Limit:", creditLimit);

        const updatedCreditLimit = creditLimit - penalty;
        console.log(
          `Dealer ${dealerId} current credit limit: ₱${creditLimit}, Updated credit limit: ₱${updatedCreditLimit}`
        );

        // Update dealer credit limit
        await axios.put(
          `https://distromentor.onrender.com/dealer/updateCreditLimit/${dealerId}?creditlimit=${updatedCreditLimit}`
        );
        console.log(`Updated dealer ${dealerId} credit limit to ₱${updatedCreditLimit}`);

        // Log success message
        console.log(
          `Penalty of ₱${penalty} deducted from dealer ${dealerId}. New credit limit: ₱${updatedCreditLimit}`
        );

        // Show alert
        headerHandleAlert(
          "Overdue Payment",
          ` Unable to pay on time. A penalty of ₱${penalty} has been deducted from the dealer's credit limit.`,
          "warning"
        );
      } else {
        console.log(
          `Payment record ${record.paymentId} is not overdue. Status: ${record.status}, Due Date: ${record.dueDate}`
        );
      }
    }

    console.log("Finished processing all payment records.");
  } catch (error) {
    console.error("Error handling overdue payments:", error);
    headerHandleAlert(
      "Error",
      "Failed to process overdue payments.",
      "error"
    );
  }
};
const [hasCheckedOverdue, setHasCheckedOverdue] = useState(false);

useEffect(() => {
  if (objectId && !hasCheckedOverdue) {
    handleOverduePayments();
    setHasCheckedOverdue(true); // Mark it as executed
  }
}, [objectId, hasCheckedOverdue]);

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
      {!printing ? (
        <div>
          {order ? (
            <div>
              <Grid container style={{ position: 'relative', justifyContent: "center", alignItems: "center" }}>
                <Grid>
                  <div style={{ display: "flex", flexDirection: 'row', paddingTop: 7, paddingLeft: 20 }}>
                    <Grid item>
                      <ContentNameTypography>Order Transaction Details</ContentNameTypography>
                    </Grid>
                    <Grid item className="no-print">
                      <StyledPrintDiv>
                        <Button variant="outlined" onClick={handlePrint}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                          </svg>
                        </Button>
                      </StyledPrintDiv>
                    </Grid>
                  </div>
                </Grid>
                <Grid container style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                  <StyleLabelData style={{ paddingTop: 75, marginLeft: -890 }}>Dealer Contact Information</StyleLabelData>
                </Grid>
                <Grid container style={{ position: 'relative', justifyContent: "center", alignItems: "center" }}>
                  <Grid item>
                    <StyleLabel style={{ marginLeft: 100 }}>Dealer Name</StyleLabel>
                    <StyleData style={{ marginLeft: 100 }}>{order?.dealer.firstname} {order?.dealer.middlename} {order?.dealer.lastname}</StyleData>
                  </Grid>

                  <Grid item>
                    <StyleLabel style={{ marginLeft: -90 }}>Dealer ID</StyleLabel>
                    <StyleData style={{ marginLeft: -90 }}>{order?.dealer.dealerid}</StyleData>
                  </Grid>

                  <Grid item>
                    <StyleLabel style={{ marginLeft: -100 }}>Email Address</StyleLabel>
                    <StyleData style={{ marginLeft: -100 }}>{order?.dealer.emailaddress}</StyleData>
                  </Grid>

                  <Grid item>
                    <StyleLabel style={{ marginLeft: -30 }}>Contact Number</StyleLabel>
                    <StyleData style={{ marginLeft: -29 }}>{order?.dealer.contactnumber}</StyleData>
                  </Grid>

                  <Grid item>
                    <StyleLabel style={{ marginLeft: -50 }}>Address</StyleLabel>
                    <StyleData style={{ marginLeft: -50 }}>{order?.dealer.currentaddress}</StyleData>
                  </Grid>
                </Grid>
                <Grid container style={{ paddingTop: 10, position: 'relative', justifyContent: "center", alignItems: "center" }}>
                  <StyleLabelData style={{ paddingTop: 75, marginLeft: -860 }}>Order Transaction Information</StyleLabelData>
                </Grid>
                <Grid container style={{ position: 'relative', justifyContent: "center", alignItems: "center" }}>
                  <Grid item>
                    <StyleLabel style={{ marginLeft: 80 }}>Order Transaction ID</StyleLabel>
                    <StyleData style={{ marginLeft: 110, marginRight: 20 }}>{order?.orderid}</StyleData>
                  </Grid>

                  <Grid item>
                    <StyleLabel style={{ marginLeft: -100 }}>Order Transaction Date</StyleLabel>
                    <StyleData style={{ marginLeft: -50 }}>{order?.orderdate}</StyleData>
                  </Grid>

                  <Grid item>
                    <StyleLabel style={{ marginLeft: -100 }}>Php Total Ordered Amount</StyleLabel>
                    <StyleData style={{ marginLeft: -40 }}>₱ {order?.orderamount}</StyleData>
                  </Grid>
                </Grid>
                <Grid container style={{ position: 'relative', justifyContent: "center", alignItems: "center" }}>
                  <StyleLabelData style={{ paddingTop: 100, marginLeft: -970 }}>Order Breakdown</StyleLabelData>
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
                    {user.tableName !== "Distributor" && ( // Conditionally render the button
                      <Grid item>
                        <StyledButton variant="contained" onClick={handleOpenDialog}>
                          Pay
                        </StyledButton>
                      </Grid>
                    )}
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
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) =>
                                    handleFileChange(event, record.paymentId) // Handle file selection
                                  }
                                  disabled={
                                    record.status === "Paid" ||
                                    record.status === "Pending"
                                  } // Disable file upload if already paid or overdue
                                />
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handlePayWithProof(record)}
                                  disabled={
                                    record.status === "Paid" ||
                                    record.status === "Pending"
                                  } // Disable button if already paid or overdue
                                >
                                  Pay
                                </Button>
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
      ) : (
        <OrderTransactionDetailsPrint order={order!} />
      )}
    </div>
  );
}
