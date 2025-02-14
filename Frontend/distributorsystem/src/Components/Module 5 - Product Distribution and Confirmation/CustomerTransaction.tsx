import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert, AlertTitle, Box, Button, Grid, LinearProgress, Paper, Slide, SlideProps, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from "@mui/material";
import { ICustomerOrder } from "../../RestCalls/Interfaces";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import OrderTransactionDetailsPrint from "./OrderTransactionDetailsPrint";
import logo5 from '../../Global Components/Images/logo5.png';

function SlideTransitionDown(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

interface DepositRecord {
  id: string;
  orderid: string;
  depositDate: string;
  deposit: number;
  remainingBalance: number;
  penalty: number;
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
  position: 'relative', // Ensure it stays in the normal flow
  paddingTop: 40,
  marginLeft: -500,
  zIndex: 10, // Higher z-index to ensure it's on top
  '& Button': {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Inter',
    width: '50px',
    height: 40,
    marginLeft: 10,
    backgroundColor: '#f5f5f5', // Visible background
    border: '1px solid #ccc',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#2C85E7',
      transform: 'scale(1.1)',
    },
    ':focus': {
      outline: '2px solid #2C85E7',
    },
    transition: 'all 0.4s',
    '@media(max-width:900px)': {
      height: 40,
      marginLeft: 0,
    },
  },

  '@media print': {
    display: 'none',
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
    margin: '10px 0px 0px 10px', // Reduce margins for print
    width: '100%', // Expand to fit the page
    pageBreakInside: 'avoid', // Avoid page breaks inside the container
    boxShadow: 'none', // Remove box shadow
    background: 'white', // Remove background gradient
  },
});

export function CustomerTransaction() {
  const [order, setOrder] = useState<ICustomerOrder | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alerttitle, setTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [deposit, setDeposit] = useState<number>(0);
  const { objectId } = useParams();
  const [depositRecords, setDepositRecords] = useState<DepositRecord[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  // Handle opening the dialog
    const handleClickOpen = () => {
      setOpenDialog(true);
    };

    // Handle closing the dialog
    const handleClose = () => {
      setOpenDialog(false);
    };

  useEffect(() => {
    axios
      .get<ICustomerOrder>(`https://distromentor.onrender.com/customerOrder/getCustomerOrderById/${objectId}`)
      .then((response) => setOrder(response.data))
      .catch((error) => {
        console.error("Error fetching order data:", error);
        headerHandleAlert('Error', "Failed to retrieve order data. Please try again.", 'error');
      });
  }, [objectId]);

  useEffect(() => {
    if (!order) return;

    axios
      .get(`https://distromentor.onrender.com/records/order/${order.orderid}`)
      .then((response) => {
        setDepositRecords(response.data);
        console.log("Deposit records successfully fetched:", response.data); // Log the fetched deposit records
      })
      .catch((error) => {
        console.error("Error fetching deposit records:", error);
      });
  }, [order]);

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

  const handlePrint = () => {
    window.print(); // Directly triggers the print dialog
  };

    const handleDepositSubmit = () => {
      if (!order) return;

      // Calculate the new deposit value by adding the existing deposit and the new deposit input
      const newDeposit = order.deposit + deposit;

      // Determine the new status based on the updated deposit amount
      let updatedStatus = order.status;
      if (newDeposit > 0 && newDeposit < order.orderamount) {
        updatedStatus = "Pending"; // Status is "Pending" when deposit is non-zero but less than order amount
      } else if (newDeposit === order.orderamount) {
        updatedStatus = "Closed"; // Status is "Closed" when deposit equals the order amount
      }

      // Build the payload for updating the order with the updated deposit and status
      const orderPayload = {
        customerid: order.customerid,
        dealerid: order.dealerid,
        distributiondate: order.distributiondate,
        orderdate: order.orderdate,
        orderamount: order.orderamount,
        deposit: newDeposit, // This is the only value being updated
        status: updatedStatus, // Update the status based on the deposit
        customer: order.customer,
        orderedproducts: order.orderedproducts,
      };

      // Create the payload for the deposit record
      const depositRecordPayload = {
        orderid: order.orderid, // Assuming order.orderid is available
        dealerid: order.dealerid,
        depositDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        deposit: deposit, // The new deposit value
        remainingBalance: order.orderamount - newDeposit
      };

      // Make a PUT request to update the order
      axios
        .put(`https://distromentor.onrender.com/customerOrder/${objectId}`, orderPayload)
        .then(() => {
          // On successful order update, create the deposit record
          axios
            .post('https://distromentor.onrender.com/records/create', depositRecordPayload) // Using the correct endpoint
            .then(() => {
              headerHandleAlert("Success", "Deposit and status updated successfully, deposit record created.", "success");
              window.location.reload();
            })
            .catch((error) => {
              console.error("Error creating deposit record:", error);
              headerHandleAlert("Error", "Failed to create deposit record. Please try again.", "error");
            });
        })
        .catch((error) => {
          console.error("Error updating deposit and status:", error);
          headerHandleAlert("Error", "Failed to update deposit and status. Please try again.", "error");
        });
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
                        <ContentNameTypography>Payment Transaction Details</ContentNameTypography>
                      </Grid>
                      <Grid item className="no-print">
                        <StyledPrintDiv>
                            <Button variant="outlined" onClick={handlePrint} className="no-print">
                                <svg xmlns="https://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                </svg>
                            </Button>
                        </StyledPrintDiv>

                      </Grid>
                    </div>
                  </Grid>
                  <Grid container style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                      <StyleLabelData style={{ paddingTop: 75, marginRight: -100 }}>Customer Contact Information</StyleLabelData>
                  </Grid>
                  <Grid container style={{ position: 'relative', justifyContent: "center", alignItems: "center" }}>
                    <Grid item>
                      <StyleLabel style={{ marginLeft: 100 }}>Customer Name</StyleLabel>
                      <StyleData style={{ marginLeft: 100 }}>
                      {order.customer
                       ? `${order.customer.firstName} ${order.customer.lastName}`
                       : 'Customer data not available'}
                      </StyleData>
                    </Grid>

                    <Grid item>
                      <StyleLabel style={{ marginLeft: -50 }}>Customer ID</StyleLabel>
                      <StyleData style={{ marginLeft: -50 }}>{order.customerid}</StyleData>
                    </Grid>

                    <Grid item>
                      <StyleLabel style={{ marginLeft: -30 }}>Contact Number</StyleLabel>
                      <StyleData style={{ marginLeft: -29 }}>{order.customer?.customerContactNumber}</StyleData>
                    </Grid>

                    <Grid item>
                      <StyleLabel style={{ marginLeft: -50 }}>Address</StyleLabel>
                      <StyleData style={{ marginLeft: -65 }}>{order.customer?.customerAddress}</StyleData>
                    </Grid>
                  </Grid>
                  <Grid container style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                        <StyleLabelData style={{ paddingTop: 75, marginRight: -100 }}>Order Transaction Information</StyleLabelData>
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

                    {/* Deposit Record Section */}
                    {depositRecords.length > 0 && (
                      <>
                        <Grid container style={{ position: 'relative', justifyContent: "center", alignItems: "center" }}>
                          <StyleLabelData style={{ paddingTop: 100, marginLeft: -1030 }}>Payment</StyleLabelData>
                        </Grid>
                        <PaperStyle>
                          <TableContainer>
                            <Table aria-label="deposit records table">
                              <TableHead style={{ backgroundColor: 'rgb(45, 133, 231, 0.08)' }}>
                                <TableRow>
                                  <TableHeaderCell align="center" sx={{ color: '#707070' }}>Deposit ID</TableHeaderCell>
                                  <TableHeaderCell align="center" sx={{ color: '#707070' }}>Deposit Date</TableHeaderCell>
                                  <TableHeaderCell align="center" sx={{ color: '#707070' }}>Deposit</TableHeaderCell>
                                  <TableHeaderCell align="center" sx={{ color: '#707070' }}>Remaining Balance</TableHeaderCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {depositRecords.map((record, index) => (
                                  <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? 'inherit' : 'rgb(45, 133, 231, 0.08)' }}>
                                    <TableCell align="center">{record.id}</TableCell>
                                    <TableCell align="center">{record.depositDate}</TableCell>
                                    <TableCell align="center">₱ {record.deposit}</TableCell>
                                    <TableCell align="center">₱ {record.remainingBalance}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Grid container style={{ position: 'relative', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                            <Grid item style={{ marginRight: '10px' }}>
                              <StyleTotalLabel>Status:</StyleTotalLabel>
                            </Grid>
                            <Grid item>
                              <StyleTotalPaper>
                                <StyleTotalData
                                  style={{
                                    color: order?.status === 'Pending' ? 'orange' :
                                           order?.status === 'Closed' ? 'red' :
                                           'black', // Default color
                                  }}
                                >
                                  {order?.status}
                                </StyleTotalData>
                              </StyleTotalPaper>
                            </Grid>
                          </Grid>
                        </PaperStyle>
                      </>
                    )}


                      <div className="no-print" style={{ zIndex: 5, position: 'relative' }}>
                            <Grid
                              container
                              style={{
                                position: "fixed", // Fix the container to the viewport
                                top: 120, // Distance from the top of the page
                                right: 70, // Distance from the right of the page
                                justifyContent: "flex-end", // Align items to the right
                                alignItems: "center", // Align items vertically in the center
                                padding: "10px", // Add some padding for spacing
                              }}
                            >

                              {/* Conditionally render the Pay Button if status is not Closed */}
                              {order?.status !== "Closed" && (
                                <Grid item>
                                  <Button variant="contained" onClick={handleClickOpen}>
                                    Pay
                                  </Button>
                                </Grid>
                              )}
                            </Grid>

                            {/* Dialog for Deposit Payment */}
                            <Dialog open={openDialog} onClose={handleClose}>
                              <DialogTitle>Deposit Payment</DialogTitle>
                              <DialogContent>
                                {/* Displaying the Deposit, Remaining Balance, and Status inside the dialog */}
                                <Paper style={{ padding: 20, marginBottom: 20 }}>
                                  <Typography variant="subtitle1" style={{ fontWeight: "bold" }} color="textSecondary">
                                    Deposit:{" "}
                                    <span style={{ color: "green" }}>
                                      {order && order.deposit > 0 ? order.deposit : "No deposit yet"}
                                    </span>
                                    <br />
                                    Remaining Balance:{" "}
                                    <span style={{ color: "red" }}>
                                      {order ? Math.max(order.orderamount - (order.deposit || 0), 0) : "N/A"}
                                    </span>
                                    <br />
                                    Status:{" "}
                                    <span
                                      style={{
                                        color:
                                          order?.status === "Pending"
                                            ? "orange"
                                            : order?.status === "Open"
                                            ? "green"
                                            : order?.status === "Closed"
                                            ? "red"
                                            : "black", // Default color if no status
                                      }}
                                    >
                                      {order ? order.status : "N/A"}
                                    </span>
                                  </Typography>
                                </Paper>

                                {/* TextField for Deposit Amount */}
                                <TextField
                                  label="Deposit Amount"
                                  type="number"
                                  value={deposit === 0 ? "" : deposit}
                                  onChange={(e) => setDeposit(Number(e.target.value))}
                                  variant="outlined"
                                  fullWidth
                                  style={{ marginBottom: 20 }}
                                />
                              </DialogContent>

                              {/* Dialog Actions */}
                              <DialogActions>
                                <Button
                                  onClick={handleClose}
                                  sx={{ color: 'red' }} // Red color for Cancel button
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleDepositSubmit}
                                  sx={{ color: 'green' }} // Green color for Submit button
                                >
                                  Submit
                                </Button>
                              </DialogActions>

                            </Dialog>
                          </div>
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
