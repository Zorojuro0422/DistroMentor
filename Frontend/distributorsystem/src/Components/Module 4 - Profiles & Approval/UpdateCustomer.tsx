import styled from "@emotion/styled";
import { Alert, AlertTitle, Button, FormHelperText, Grid, Snackbar, TextField, Typography, Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import dealer1 from '../../Global Components/Images/dealer1-2.png';
import logo4 from '../../Global Components/Images/logo4.png';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

interface Customer {
  customerID: string;
  dealerID: string;
  firstName: string;
  lastName: string;
  customerContactNumber: string;
  customerAddress: string;
}

const StyledCard = styled(Card)({
  padding: '10px 10px 10px 10px',
  display: 'flex',
  marginTop: 50,
  width: '1280px',
  height: '600px',
  alignItems: 'center',
  borderRadius: '25px',
  justifyContent: 'left',
  backgroundColor: ' rgba(255, 255, 255, 0.8)',
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

const UpdateCustomer: React.FC = () => {
  const { objectId } = useParams<{ objectId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer>({
    customerID: '',
    dealerID: '',
    firstName: '',
    lastName: '',
    customerContactNumber: '',
    customerAddress: '',
  });
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [fieldWarning, setFieldWarning] = useState({
    firstName: '',
    lastName: '',
    dealerID: '',
    customerContactNumber: '',
    customerAddress: '',
  });

  useEffect(() => {
      fetchCustomer();
    }, []);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/customer/${objectId}`);
      setCustomer(response.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };

  const handleUpdate = async () => {
    if (!customer.firstName || !customer.lastName || !customer.dealerID || !customer.customerContactNumber || !customer.customerAddress) {
      setFieldWarning({
        firstName: !customer.firstName ? 'First Name is required' : '',
        lastName: !customer.lastName ? 'Last Name is required' : '',
        dealerID: !customer.dealerID ? 'Dealer ID is required' : '',
        customerContactNumber: !customer.customerContactNumber ? 'Customer Contact Number is required' : '',
        customerAddress: !customer.customerAddress ? 'Customer Address is required' : '',
      });
      return;
    }

    try {
      await axios.put(`http://localhost:8080/customer/${objectId}`, customer);
      setUpdateSuccess(true);
      setTimeout(() => {
        navigate('/customerList');
      }, 2000);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer: Customer) => ({
      ...prevCustomer,
      [name]: value,
    }));
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
            <ContentNameTypography>Update Customer</ContentNameTypography>
            <div style={{ paddingTop: 30, paddingBottom: 50 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="First Name" name="firstName" style={{ width: '700px' }} value={customer.firstName} onChange={handleChange} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.firstName}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Last Name" name="lastName" style={{ width: '700px' }} value={customer.lastName} onChange={handleChange} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.lastName}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Dealer ID" name="dealerID" style={{ width: '700px' }} value={customer.dealerID} onChange={handleChange} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.dealerID}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Customer Contact Number" name="customerContactNumber" style={{ width: '700px' }} value={customer.customerContactNumber} onChange={handleChange} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.customerContactNumber}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Customer Address" name="customerAddress" style={{ width: '700px' }} value={customer.customerAddress} onChange={handleChange} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.customerAddress}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginTop: '20px', width: '700px' }}>
                    Update
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        </StyledCard>
       <Snackbar
         open={updateSuccess}
         autoHideDuration={3000}
         onClose={() => setUpdateSuccess(false)}
         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
         style={{ marginTop: 60 }} // Adjust the value as needed
       >
         <Alert onClose={() => setUpdateSuccess(false)} severity="success" sx={{ width: 500 }}>
           <AlertTitle style={{ textAlign: 'left', fontWeight: 'bold' }}>Success</AlertTitle>
           Customer Updated Successfully!
         </Alert>
       </Snackbar>
      </StyleGrid>
    </div>
  );
};

export default UpdateCustomer;
