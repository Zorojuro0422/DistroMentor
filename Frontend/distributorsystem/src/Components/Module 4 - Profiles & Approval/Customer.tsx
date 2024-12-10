import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from "@emotion/styled";
import dealer1 from '../../Global Components/Images/dealer1-2.png';
import logo4 from '../../Global Components/Images/logo4.png';
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
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

interface Customer {
  customerID: string;
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
  height: 10,
  marginTop: "10px",
  marginBottom: '55px',
  width: '100%',
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

const Container = styled.div({
  width: '100%',
  padding: '1px 1px 1px 30px',
  display: 'flex',
  flexDirection: 'column',
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
  const { objectId } = useParams<{ objectId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Object ID:', objectId);
    fetchCustomers();
  }, [objectId]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`https://distromentor.onrender.com/customer/dealer/${objectId}`);
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
        await axios.delete(`https://distromentor.onrender.com/customer/${selectedCustomerID}`);
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(search.toLowerCase())
  );

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
          <Container>
            <ContentNameTypography>Customer List</ContentNameTypography>
            <StyledTextField
              label="Search by Name"
              value={search}
              onChange={handleSearchChange}
            />
            <div style={{ paddingTop: 30, paddingBottom: 50 }}>
              <Grid container spacing={3}>
                {/* Table Header */}
                <Grid item xs={12}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', border: '2px solid black', backgroundColor: 'white' }}>
                    <thead style={{ backgroundColor: '#f2f2f2' }}>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Customer ID</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>First Name</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Last Name</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Contact Number</th>
                        <th style={{ border: '1px solid black', padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Customer Address</th>

                      </tr>
                    </thead>
                    <tbody>
                      {/* Render customers data */}
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.customerID}>
                          <td style={{ border: '1px solid black', padding: '10px' }}>{customer.customerID}</td>
                          <td style={{ border: '1px solid black', padding: '10px' }}>{customer.firstName}</td>
                          <td style={{ border: '1px solid black', padding: '10px' }}>{customer.lastName}</td>
                          <td style={{ border: '1px solid black', padding: '10px' }}>{customer.customerContactNumber}</td>
                          <td style={{ border: '1px solid black', padding: '10px' }}>{customer.customerAddress}</td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Grid>
              </Grid>
            </div>
          </Container>
        </StyledCard>
      </StyleGrid>

      {/* Snackbar for alerts */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog for deletion */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCustomer} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomerList;
