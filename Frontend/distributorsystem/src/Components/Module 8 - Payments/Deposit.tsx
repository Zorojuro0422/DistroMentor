import React, { useState, useEffect } from "react";
import { Button, FormHelperText, Grid, Snackbar, TextField, Typography, Card, Slide } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dealer1 from '../../Global Components/Images/dealer1-2.png';
import logo4 from '../../Global Components/Images/logo4.png';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';  // Import moment

// Styled components
const StyledCard = styled(Card)({
  padding: '10px 10px 10px 10px',
  display: 'flex',
  marginTop: 50,
  width: '1280px',
  height: '600px',
  alignItems: 'center',
  borderRadius: '25px',
  justifyContent: 'left',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(50px)',
  border: '0px solid rgba(255, 255, 255, 0.3)'
});

const StyleGrid = styled(Grid)({
  position: "relative",
  display: "flex",
  justifyContent: "center",
});

const ContentNameTypography = styled(Typography)({
  paddingTop: '15px',
  fontFamily: 'Inter',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '25px',
  margin: '-15px 0 10px -450px',
  paddingLeft: '10px',
  color: '#203949',
});

const StyledTextField = styled(TextField)({
  borderRadius: "22px",
  width: '343px',
  height: 10,
  marginTop: "10px",
  marginBottom: '55px',
  input: {
    color: '#707070',
    fontFamily: 'Inter'
  },
  label: {
    color: '#707070',
    fontWeight: '550',
    fontFamily: 'Inter',
  },
});

const ButtonStyle = styled(Button)({
  backgroundColor: '#2D85E7',
  width: '380px',
  height: '40px',
  ':hover': {
    backgroundColor: 'rgba(45, 133, 231, 0.9)',
    transform: 'scale(1.1)'
  },
  transition: 'all 0.4s'
});

// Transition component for Snackbar
function SlideTransitionDown(props: any) {
  return <Slide {...props} direction="down" />;
}

export default function DepositForm() {
  const navigate = useNavigate();
  const [transactionNumber, setTransactionNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [proofOfRemittance, setProofOfRemittance] = useState<File | null>(null); // Updated to handle File
  const [dealerID, setDealerID] = useState('');
  const [distributorID, setDistributorID] = useState(''); // Automatically fetched distributorID
  const [paymentDate, setPaymentDate] = useState(''); // New state for paymentDate
  const [status] = useState('pending'); // Status is set to "pending"
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'warning' | 'error'>('success');
  const [fieldWarning, setFieldWarning] = useState({
    amount: '',
    proofOfRemittance: '',
    distributorID: '',
  });

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");

    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);

        console.log("Parsed User from Storage:", parsedUser);

        if (parsedUser && parsedUser.dealer) {
          const dealerID = parsedUser.dealer.dealerid;
          const distributorID = parsedUser.dealer.distributor.distributorid; // Extract distributorid from dealer object

          if (dealerID) {
            setDealerID(dealerID);
            console.log('Dealer ID:', dealerID); // Debugging
          } else {
            console.error("Dealer ID is missing in the parsed user object.");
          }

          if (distributorID) {
            setDistributorID(distributorID); // Set distributorID from dealer object
            console.log('Distributor ID:', distributorID); // Debugging
          } else {
            console.error("Distributor ID is missing in the parsed user object.");
          }
        } else {
          console.error("Dealer data is missing in localStorage.");
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    } else {
      console.error("No user found in localStorage.");
    }

    // Generate the transaction number
    setTransactionNumber(uuidv4().slice(0, 8));  // Automatically generate a transaction number

    // Automatically set the paymentDate using moment to format the current date and time
    const currentDate = moment().format('YYYY-MM-DDTHH:mm:ss');
    setPaymentDate(currentDate);

  }, []);

  const handleSubmit = () => {
    if (!amount || !proofOfRemittance || !dealerID || !distributorID) {  // Ensure distributorID is also set
      setFieldWarning({
        amount: !amount ? 'Amount is required' : '',
        proofOfRemittance: !proofOfRemittance ? 'Proof of remittance is required' : '',
        distributorID: !distributorID ? 'Distributor ID is required' : '',
      });
      return;
    }

    // Debugging the values before form submission
    console.log("Transaction Number:", transactionNumber);
    console.log("Amount:", amount);
    console.log("Dealer ID:", dealerID);
    console.log("Distributor ID:", distributorID);
    console.log("Proof of Remittance File:", proofOfRemittance);
    console.log("Payment Date:", paymentDate);
    console.log("Status:", status); // Status is logged as "pending"

    const formData = new FormData();
    formData.append('transactionNumber', transactionNumber);  // Ensure parameter matches backend expectation
    formData.append('amount', amount);
    formData.append('proofOfRemittance', proofOfRemittance!); // Add the image file
    formData.append('dealerId', dealerID);
    formData.append('distributorId', distributorID);  // Automatically fetched distributorID
    formData.append('paymentDate', paymentDate);  // Pass formatted date and time for paymentDate using moment
    formData.append('status', status);  // Pass "pending" status

    const url = 'http://localhost:8080/api/deposits/create';

    axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        setAmount('');
        setProofOfRemittance(null);
        setDistributorID(''); // Clear distributorID after submission
        setFieldWarning({
          amount: '',
          proofOfRemittance: '',
          distributorID: '',
        });
        setAlertTitle('Success');
        setAlertMessage('Deposit Submitted Successfully!');
        setAlertSeverity('success');
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error('Error submitting deposit:', error.response?.data || error.message);
        setAlertTitle('Error');
        setAlertMessage(`An error occurred: ${error.response?.data || error.message}`);
        setAlertSeverity('error');
        setOpenSnackbar(true);
      });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProofOfRemittance(file);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div style={{ background: 'linear-gradient(#004AAD, #5DE0E6)', width: '100vw', height: '100vh', position: 'fixed' }}>
      <StyleGrid>
        <StyledCard>
          <div style={{ backgroundColor: 'rgb(45, 133, 231, 0.8)', width: '40%', height: 800, marginLeft: -10 }}>
            <img src={logo4}
              style={{
                width: 'auto',
                marginLeft: 0,
                padding: '170px 20px 0px 75px',
                height: '180px',
                alignItems: 'center',
                display: 'flex',
                position: 'relative',
                zIndex: 2
              }}
            />
            <img src={dealer1}
              style={{
                width: 'auto',
                height: '600px',
                marginTop: -130,
                marginLeft: 30,
                display: 'flex',
                position: 'relative',
                zIndex: 1
              }} />
          </div>

          <div style={{ padding: '1px 1px 1px 30px', display: 'flex', flexDirection: 'column' }}>
            <ContentNameTypography>Submit Deposit</ContentNameTypography>
            <div style={{ paddingTop: 30, paddingBottom: 50 }}>
              <Grid container spacing={3}>
                {/* Textfield For Amount */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Amount" style={{ width: '700px' }} value={amount} onChange={(e) => setAmount(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.amount}
                  </FormHelperText>
                </Grid>
                {/* File Input for Proof of Remittance */}
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'block', marginTop: '10px' }}
                  />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.proofOfRemittance}
                  </FormHelperText>
                </Grid>
              </Grid>
              <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                <Grid item>
                  <ButtonStyle variant="contained" onClick={handleSubmit}>
                    Submit Deposit
                  </ButtonStyle>
                </Grid>
              </Grid>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={SlideTransitionDown}
              >
                <Alert onClose={handleCloseSnackbar} severity={alertSeverity as 'success' | 'warning' | 'error'} sx={{ width: 500 }}>
                  <AlertTitle style={{ textAlign: 'left', fontWeight: 'bold' }}>{alertTitle}</AlertTitle>
                  {alertMessage}
                </Alert>
              </Snackbar>
            </div>
          </div>
        </StyledCard>
      </StyleGrid>
    </div>
  );
}
