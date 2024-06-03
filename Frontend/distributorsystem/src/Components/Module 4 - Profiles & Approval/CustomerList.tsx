import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from "@emotion/styled";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Card,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from "@mui/material";

interface Customer {
  customerID: string;
  dealerID: string;
  customerName: string;
  customerContactNumber: string;
  customerAddress: string;
}

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

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [fieldWarning, setFieldWarning] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomerID, setSelectedCustomerID] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/customer/getAllCustomer');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleOpenDialog = (customerID: string) => {
    setSelectedCustomerID(customerID);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCustomerID(null);
  };

  const handleDeleteCustomer = async () => {
    if (selectedCustomerID) {
      try {
        await axios.delete(`http://localhost:8080/customer/delete/${selectedCustomerID}`);
        setAlertMessage('Customer deleted successfully');
        setAlertSeverity('success');
        setOpenSnackbar(true);
        fetchCustomers(); // Refresh the list
        handleCloseDialog();
      } catch (error) {
        setAlertMessage('Failed to delete customer');
        setAlertSeverity('error');
        setOpenSnackbar(true);
        console.error('Error deleting customer:', error);
      }
    }
  };

  return (
    <div style={{ background: 'linear-gradient(#004AAD, #5DE0E6)', width: '100vw', height: '100vh', position: 'fixed' }}>
      <StyleGrid>
        <StyledCard>
          <div style={{ backgroundColor: 'rgb(45, 133, 231, 0.8)', width: '40%', height: 1000, marginLeft: -10 }}>
            {/* Dealer and Logo Images */}
          </div>

          <div style={{ padding: '1px 1px 1px 30px', display: 'flex', flexDirection: 'column' }}>
            <ContentNameTypography>Customer List</ContentNameTypography>
            <div style={{ paddingTop: 30, paddingBottom: 50 }}>
              <Grid container spacing={3}>
                {/* Table Header */}
                <Grid item xs={12}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', border: '2px solid black', backgroundColor: 'white' }}>
                    <thead style={{ backgroundColor: '#f2f2f2' }}>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Customer ID</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Dealer ID</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Customer Name</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Contact Number</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Customer Address</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Render customers data */}
                      {customers.map((customer) => (
                        <tr key={customer.customerID}>
                          <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>{customer.customerID}</td>
                          <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>{customer.dealerID}</td>
                          <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>{customer.customerName}</td>
                          <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>{customer.customerContactNumber}</td>
                          <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>{customer.customerAddress}</td>
                          <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>
                            <a href={`/update_product/${customer.customerID}`} style={{ color: 'green' }}>Edit</a>
                            <a href="#" onClick={() => handleOpenDialog(customer.customerID)} style={{ color: 'red', marginLeft: '10px' }}>Delete</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Grid>
              </Grid>
            </div>
          </div>
        </StyledCard>
      </StyleGrid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Customer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCustomer} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomerList;
