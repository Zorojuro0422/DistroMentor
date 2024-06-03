import React, { useState, useEffect } from "react";
import { Button, FormHelperText, Grid, Snackbar, TextField, Typography, Card, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dealer1 from '../../Global Components/Images/dealer1-2.png';
import logo4 from '../../Global Components/Images/logo4.png';


interface Dealer {
  dealerid: string;
  firstname: string;
  lastname: string;
  customerids: string[]; // Add this line to include customerids property
}

// Styled components
const StyledCard = styled(Card)({
  padding: '10px 10px 10px 10px',
  display: 'flex',
  marginTop: 50,
  width: '1280px',
  height: '800px',
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
  marginBottom: '43px',
  margin: '10px 0 0 80px',
  height: '40px',
  marginRight: '-110px',
  ':hover': {
    backgroundColor: 'rgba(45, 133, 231, 0.9)',
    transform: 'scale(1.1)'
  },
  transition: 'all 0.4s'
});

export default function ProductRegistration() {
  const navigate = useNavigate();
  const [customerID, setCustomerID] = useState('');
  const [dealerID, setDealerID] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerContactNumber, setCustomerContactNumber] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerSalesAmount, setCustomerSalesAmount] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [fieldWarning, setFieldWarning] = useState({
    customerID: '',
    dealerID: '',
    customerName: '',
    customerContactNumber: '',
    customerAddress: '',
    customerSalesAmount: '',
  });
  const [dealers, setDealers] = useState<Dealer[]>([]);

  useEffect(() => {
    // Fetch the list of dealers from the backend
    axios.get('https://distromentor-capstone.onrender.com/dealer/getAllDealers')
      .then(response => {
        setDealers(response.data);
      })
      .catch(error => {
        console.error('Error fetching dealers:', error);
      });
  }, []);

  const handleSubmit = () => {
    if (!customerID || !dealerID || !customerName || !customerContactNumber || !customerAddress || !customerSalesAmount) {
      setFieldWarning({
        customerID: !customerID ? 'Customer ID is required' : '',
        dealerID: !dealerID ? 'Dealer ID is required' : '',
        customerName: !customerName ? 'Customer Name is required' : '',
        customerContactNumber: !customerContactNumber ? 'Contact Number is required' : '',
        customerAddress: !customerAddress ? 'Address is required' : '',
        customerSalesAmount: !customerSalesAmount ? 'Sales Amount is required' : '',
      });
      return;
    }

    const customerData = {
      customerID: customerID,
      dealerID: dealerID,
      customerName: customerName,
      customerContactNumber: customerContactNumber,
      customerAddress: customerAddress,
      customerSalesAmount: parseFloat(customerSalesAmount),
    };

    const url = 'http://localhost:8080/customer/createCustomer';

    axios
      .post(url, customerData)
      .then((response) => {
        // Update the dealer's customerids array
        const updatedDealers = dealers.map((dealer) => {
          if (dealer.dealerid === dealerID) {
            return {
              ...dealer,
              customerids: [customerID]
            };
          }
          return dealer;
        });

        setDealers(updatedDealers);

        // Clear form fields after successful submission
        setCustomerID('');
        setDealerID('');
        setCustomerName('');
        setCustomerContactNumber('');
        setCustomerAddress('');
        setCustomerSalesAmount('');
        setFieldWarning({
          customerID: '',
          dealerID: '',
          customerName: '',
          customerContactNumber: '',
          customerAddress: '',
          customerSalesAmount: '',
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
          <div style={{ backgroundColor: 'rgb(45, 133, 231, 0.8)', width: '40%', height: 1000, marginLeft: -10 }}>
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
                {/* Textfield For Customer ID */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Customer ID" style={{ width: '700px' }} value={customerID} onChange={(e) => setCustomerID(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.customerID}
                  </FormHelperText>
                </Grid>
                {/* Dropdown For Dealer ID */}
                <Grid item xs={12}>
                  <FormControl variant="outlined" style={{ width: '700px' }}>
                    <InputLabel>Dealer ID</InputLabel>
                    <Select
                      value={dealerID}
                      onChange={(e) => setDealerID(e.target.value)}
                      label="Dealer ID"
                    >
                      {dealers.map((dealer) => (
                        <MenuItem key={dealer.dealerid} value={dealer.dealerid}>
                          {dealer.firstname} - {dealer.lastname}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.dealerID}
                  </FormHelperText>
                </Grid>
                {/* Textfield For Customer Name */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Customer Name" style={{ width: '700px' }} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.customerName}
                  </FormHelperText>
                </Grid>
                {/* Textfield For Customer Contact Number */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Contact Number" style={{ width: '700px' }} value={customerContactNumber} onChange={(e) => setCustomerContactNumber(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.customerContactNumber}
                  </FormHelperText>
                </Grid>
                {/* Textfield For Customer Address */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Address" style={{ width: '700px' }} value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
                    <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                      {fieldWarning.customerAddress}
                    </FormHelperText>
                  </Grid>
                  {/* Textfield For Customer Sales Amount */}
                  <Grid item xs={12}>
                    <StyledTextField variant="outlined" label="Sales Amount" style={{ width: '700px' }} value={customerSalesAmount} onChange={(e) => setCustomerSalesAmount(e.target.value)} />
                    <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                      {fieldWarning.customerSalesAmount}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px', width: '700px' }}>
                      Add Customer
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </StyledCard>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={handleCloseSnackbar} severity={alertSeverity as 'success' | 'error'} sx={{ width: '100%' }}>
              <AlertTitle>{alertTitle}</AlertTitle>
              {alertMessage}
            </Alert>
          </Snackbar>
        </StyleGrid>
      </div>
    );
  }
