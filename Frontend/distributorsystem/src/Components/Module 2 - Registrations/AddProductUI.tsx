import React, { useState } from "react";
import { Button, FormHelperText, Grid, Snackbar, TextField, Typography, Card } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dealer1 from '../../Global Components/Images/dealer1-2.png';
import logo4 from '../../Global Components/Images/logo4.png';

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
  const [productID, setProductID] = useState('');
  const [productName, setProductName] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [fieldWarning, setFieldWarning] = useState({
    productID: '',
    productName: '',
    unit: '',
    price: '',
    quantity: '',
  });

  const handleSubmit = () => {
    if (!productID || !productName || !unit || !price || !quantity) {
      setFieldWarning({
        productID: !productID ? 'Product ID is required' : '',
        productName: !productName ? 'Product Name is required' : '',
        unit: !unit ? 'Unit is required' : '',
        price: !price ? 'Price is required' : '',
        quantity: !quantity ? 'Quantity is required' : '',
      });
      return;
    }

    const productData = {
      productid: productID,
      name: productName,
      unit: unit,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
    };

    const url = 'http://localhost:8080/product/AddProduct';

    axios
      .post(url, productData)
      .then((response) => {
        // Clear form fields after successful submission
        setProductID('');
        setProductName('');
        setUnit('');
        setPrice('');
        setQuantity('');
        setFieldWarning({
          productID: '',
          productName: '',
          unit: '',
          price: '',
          quantity: '',
        });
        setAlertTitle('Success');
        setAlertMessage('Product Added Successfully!');
        setAlertSeverity('success');
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error('Error submitting product:', error);
        setAlertTitle('Error');
        setAlertMessage('An error occurred while submitting the product. Please try again later.');
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
            <ContentNameTypography>Add Product</ContentNameTypography>
            <div style={{ paddingTop: 30, paddingBottom: 50 }}>
              <Grid container spacing={3}>
                {/* Textfield For Product ID */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Product ID" style={{ width: '700px' }} value={productID} onChange={(e) => setProductID(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.productID}
                  </FormHelperText>
                </Grid>
                {/* Textfield For Product Name */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Product Name" style={{ width: '700px' }} value={productName} onChange={(e) => setProductName(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.productName}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Unit" style={{ width: '700px' }} value={unit} onChange={(e) => setUnit(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.unit}
                  </FormHelperText>
                </Grid>
                {/* Textfield For Price */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Price" style={{ width: '700px' }} value={price} onChange={(e) => setPrice(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.price}
                  </FormHelperText>
                </Grid>
                {/* Textfield For Quantity */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Quantity" style={{ width: '700px' }} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning.quantity}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px', width: '700px' }}>
                    Add Product
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
