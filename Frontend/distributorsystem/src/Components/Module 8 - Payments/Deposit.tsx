import React, { useState, useEffect } from "react";
import { Button, FormHelperText, Grid, Snackbar, TextField, Typography, Card, Slide } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dealer1 from '../../Global Components/Images/dealer1-2.png';
import logo4 from '../../Global Components/Images/logo4.png';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'; // Import moment

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
  border: '0px solid rgba(255, 255, 255, 0.3)',
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
    fontFamily: 'Inter',
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
    transform: 'scale(1.1)',
  },
  transition: 'all 0.4s',
});

// Transition component for Snackbar
function SlideTransitionDown(props: any) {
  return <Slide {...props} direction="down" />;
}

export default function DepositForm() {
  const navigate = useNavigate();
  const [transactionNumber, setTransactionNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [proofOfRemittance, setProofOfRemittance] = useState<File | null>(null);
  const [dealerID, setDealerID] = useState('');
  const [distributorID, setDistributorID] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);  // Needed to Deposit
  const [totalSales, setTotalSales] = useState(0);  // Total SRP (Total Sales)
  const [profit, setProfit] = useState(0);  // Profit
  const [isConfirm] = useState(false); // Default to false since it's initially unconfirmed
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'warning' | 'error'>('success');
  const [orderId, setOrderId] = useState('');
  const [paymentId, setPaymentId] = useState('');
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

        if (parsedUser?.dealer) {
          const dealerID = parsedUser.dealer.dealerid;
          const distributorID = parsedUser.dealer.distributor.distributorid;

          if (dealerID) setDealerID(dealerID);
          if (distributorID) setDistributorID(distributorID);

          // Fetch the dealer totals by dealer ID
          fetchDealerTotals(dealerID);
        } else {
          console.error("Dealer data is missing in localStorage.");
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  // Fetch dealer totals by dealer ID
  const fetchDealerTotals = (dealerId: string) => {
    axios
      .get(`http://distromentor.onrender.com/dealerTotals/getByDealerId/${dealerId}`)
      .then((response) => {
        const { totalOrderAmount, totalSRP, profit } = response.data;
        setTotalAmount(totalOrderAmount);  // Needed to Deposit
        setTotalSales(totalSRP);  // Total Sales (SRP)
        setProfit(profit);  // Profit
      })
      .catch((error) => {
        console.error('Error fetching dealer totals:', error);
        setAlertTitle('Error');
        setAlertMessage('Unable to fetch dealer totals.');
        setAlertSeverity('error');
        setOpenSnackbar(true);
      });
  };

  useEffect(() => {
    const generateRandomLetters = () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i = 0; i < 3; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
      }
      return result;
    };

    // Generate the transaction number with 3 letters + UUID
    const newTransactionNumber = generateRandomLetters() + '-' + uuidv4().slice(0, 8);

    setTransactionNumber(newTransactionNumber); // Set the generated transaction number
    setPaymentDate(moment().format('YYYY-MM-DDTHH:mm:ss')); // Set the current date and time
  }, []);

  const handleSubmit = () => {
    if (!amount || !proofOfRemittance || !dealerID || !distributorID) {
      setFieldWarning({
        amount: !amount ? 'Amount is required' : '',
        proofOfRemittance: !proofOfRemittance ? 'Proof of remittance is required' : '',
        distributorID: !distributorID ? 'Distributor ID is required' : '',
      });
      return;
    }

    const formData = new FormData();
    formData.append('transactionNumber', transactionNumber);
    formData.append('amount', amount);
    formData.append('proofOfRemittance', proofOfRemittance!);
    formData.append('dealerId', dealerID);
    formData.append('distributorId', distributorID);
    formData.append('paymentDate', paymentDate);
    formData.append('isConfirm', String(isConfirm)); // Send as string ('false')

    const url = 'http://distromentor.onrender.com/api/deposits/create';

    axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        setAmount('');
        setProofOfRemittance(null);
        setDistributorID('');
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
    if (file) setProofOfRemittance(file);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <div style={{ background: 'linear-gradient(#004AAD, #5DE0E6)', width: '100vw', height: '100vh', position: 'fixed' }}>
      <StyleGrid>
        <StyledCard>
          <div style={{ backgroundColor: 'rgb(45, 133, 231, 0.8)', width: '40%', height: 800, marginLeft: -10 }}>
            <img src={logo4} style={{ width: 'auto', padding: '170px 20px 0px 75px', height: '180px' }} />
            <img src={dealer1} style={{ width: 'auto', height: '600px', marginTop: -130, marginLeft: 30 }} />
          </div>
          <div style={{ padding: '1px 1px 1px 30px', display: 'flex', flexDirection: 'column' }}>
            <ContentNameTypography>Submit Deposit</ContentNameTypography>
            <Typography variant="h6" sx={{ color: '#203949', fontFamily: 'Inter', marginBottom: 2 }}>
              Needed to be Deposit: ₱ {totalAmount}
            </Typography>
            <Typography variant="h6" sx={{ color: '#203949', fontFamily: 'Inter', marginBottom: 2 }}>
              Total Sales (SRP): ₱ {totalSales}
            </Typography>
            <Typography variant="h6" sx={{ color: '#203949', fontFamily: 'Inter', marginBottom: 2 }}>
              Profit: ₱ {profit}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <FormHelperText>{fieldWarning.amount}</FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <input type="file" onChange={handleFileChange} />
                <FormHelperText>{fieldWarning.proofOfRemittance}</FormHelperText>
              </Grid>
            </Grid>
            <ButtonStyle onClick={handleSubmit}>Submit Deposit</ButtonStyle>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
              <Alert severity={alertSeverity}>
                <AlertTitle>{alertTitle}</AlertTitle>
                {alertMessage}
              </Alert>
            </Snackbar>
          </div>
        </StyledCard>
      </StyleGrid>
    </div>
  );
}
