import React, { useState, useEffect } from "react";
import { Button, FormHelperText, Grid, Snackbar, TextField, Typography, Card, Slide } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import { useRestDealer } from '../../RestCalls/DealerUseRest';
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dealer1 from '../../Global Components/Images/dealer1-2.png';
import logo4 from '../../Global Components/Images/logo4.png';
import { v4 as uuidv4 } from 'uuid'; // Ensure this import is included

interface Dealer {
  dealerid: string;
  firstname: string;
  lastname: string;
  customerids: string[];
}

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

export default function CustomerRegistration() {
  const navigate = useNavigate();
  const [getDealerByID] = useRestDealer();
  const [customerID, setCustomerID] = useState('');
  const [dealerID, setDealerID] = useState('');
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerContactNumber, setCustomerContactNumber] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'warning' | 'error'>('success');
  const [fieldWarning, setFieldWarning] = useState({
    customerFirstName: '',
    customerLastName: '',
    customerContactNumber: '',
    customerAddress: '',
  });
  const [dealers, setDealers] = useState<Dealer[]>([]);

  useEffect(() => {
    // Set the dealerID from localStorage
    const userFromStorage = JSON.parse(localStorage.getItem("user")!);
    if (userFromStorage && userFromStorage.dealer) {
      setDealerID(userFromStorage.dealer.dealerid);
    }

    // Fetch the list of dealers from the backend
    axios.get('https://distromentor.onrender.com/dealer/getAllDealers')
      .then(response => {
        setDealers(response.data);
      })
      .catch(error => {
        console.error('Error fetching dealers:', error);
      });
  }, []);

  const handleSubmit = () => {
    if (!customerFirstName || !customerLastName || !customerContactNumber || !customerAddress) {
      setFieldWarning({
        customerFirstName: !customerFirstName ? 'First Name is required' : '',
        customerLastName: !customerLastName ? 'Last Name is required' : '',
        customerContactNumber: !customerContactNumber ? 'Contact Number is required' : '',
        customerAddress: !customerAddress ? 'Address is required' : '',
      });
      return;
    }

    const customerData = {
      customerID: uuidv4().slice(0, 8), // Automatically generate customer ID
      dealerID: dealerID,
      firstName: customerFirstName,
      lastName: customerLastName,
      customerContactNumber: customerContactNumber,
      customerAddress: customerAddress,
    };

    const url = 'https://distromentor.onrender.com/customer/createCustomer';

    axios
      .post(url, customerData)
      .then(() => {
        // Clear form fields after successful submission
        setCustomerFirstName('');
        setCustomerLastName('');
        setCustomerContactNumber('');
        setCustomerAddress('');
        setFieldWarning({
          customerFirstName: '',
          customerLastName: '',
          customerContactNumber: '',
          customerAddress: '',
        });
        setAlertTitle('Success');
        setAlertMessage('Customer Added Successfully!');
        setAlertSeverity('success');
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error('Error submitting customer:', error);
        setAlertTitle('Error');
        setAlertMessage('An error occurred while submitting the customer. Please try again later.');
        setAlertSeverity('error');
        setOpenSnackbar(true);
      });
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
            <ContentNameTypography>Add Customer</ContentNameTypography>
            <div style={{ paddingTop: 30, paddingBottom: 50 }}>
              <Grid container spacing={3}>
                {/* Textfield For First Name */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="First Name" style={{ width: '700px' }} value={customerFirstName} onChange={(e) => setCustomerFirstName(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.customerFirstName}
                  </FormHelperText>
                </Grid>
                {/* Textfield For Last Name */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Last Name" style={{ width: '700px' }} value={customerLastName} onChange={(e) => setCustomerLastName(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.customerLastName}
                  </FormHelperText>
                </Grid>
                {/* Textfield For Contact Number */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Contact Number" style={{ width: '700px' }} value={customerContactNumber} onChange={(e) => setCustomerContactNumber(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.customerContactNumber}
                  </FormHelperText>
                </Grid>
                {/* Textfield For Address */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Address" style={{ width: '700px' }} value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.customerAddress}
                  </FormHelperText>
                </Grid>
              </Grid>
              <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                <Grid item>
                  <ButtonStyle variant="contained" onClick={handleSubmit}>
                    Add Customer
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
