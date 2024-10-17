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
  height: '550px',
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
  const userFromStorage = JSON.parse(localStorage.getItem("user")!);
  const distributorId = userFromStorage?.distributor?.distributorid || "";
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
    suggestedRetailPrice: '',
    expirationDate: '',
  });
  const [suggestedRetailPrice, setSuggestedRetailPrice] = useState('');
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  const handleSubmit = () => {
    if (
      !productID ||
      !productName ||
      !unit ||
      !price ||
      !quantity ||
      !suggestedRetailPrice ||
      !expirationDate
    ) {
      setFieldWarning({
        productID: !productID ? 'Product ID is required' : '',
        productName: !productName ? 'Product Name is required' : '',
        unit: !unit ? 'Unit is required' : '',
        price: !price ? 'Price is required' : '',
        quantity: !quantity ? 'Quantity is required' : '',
        suggestedRetailPrice: !suggestedRetailPrice ? 'SRP is required' : '',
        expirationDate: !expirationDate ? 'Expiration Date is required' : '',
      });
      return;
    }

    const productData = {
      productid: productID,
      name: productName,
      unit: unit,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      suggestedRetailPrice: parseFloat(suggestedRetailPrice),
      expirationDate: expirationDate, // Send it as a string (YYYY-MM-DD format)
      distributorid: distributorId,
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
        setSuggestedRetailPrice('');
         setExpirationDate(null);
        setFieldWarning({
          productID: '',
          productName: '',
          unit: '',
          price: '',
          quantity: '',
          suggestedRetailPrice: '',
          expirationDate: '',
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

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', width: '100%' }}>
            <ContentNameTypography>Add Product</ContentNameTypography>
            <div style={{ paddingTop: 20, paddingBottom: 30, width: '100%' }}>
              <Grid container spacing={2}>
                {/* Textfield For Product ID */}
                <Grid item xs={6}>
                  <StyledTextField
                    variant="outlined"
                    label="Product ID"
                    fullWidth
                    value={productID}
                    onChange={(e) => setProductID(e.target.value)}
                  />
                  <FormHelperText style={{ color: '#BD9F00' }}>{fieldWarning.productID}</FormHelperText>
                </Grid>

                {/* Textfield For Product Name */}
                <Grid item xs={6}>
                  <StyledTextField
                    variant="outlined"
                    label="Product Name"
                    fullWidth
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                  <FormHelperText style={{ color: '#BD9F00' }}>{fieldWarning.productName}</FormHelperText>
                </Grid>

                {/* Textfield For Unit */}
                <Grid item xs={6}>
                  <StyledTextField
                    variant="outlined"
                    label="Unit"
                    fullWidth
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                  <FormHelperText style={{ color: '#BD9F00' }}>{fieldWarning.unit}</FormHelperText>
                </Grid>

                {/* Textfield For Price */}
                <Grid item xs={6}>
                  <StyledTextField
                    variant="outlined"
                    label="Price"
                    fullWidth
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <FormHelperText style={{ color: '#BD9F00' }}>{fieldWarning.price}</FormHelperText>
                </Grid>

                {/* Textfield For Quantity */}
                <Grid item xs={6}>
                  <StyledTextField
                    variant="outlined"
                    label="Quantity"
                    fullWidth
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <FormHelperText style={{ color: '#BD9F00' }}>{fieldWarning.quantity}</FormHelperText>
                </Grid>

                {/* Textfield For SRP */}
                <Grid item xs={6}>
                  <StyledTextField
                    variant="outlined"
                    label="SRP"
                    fullWidth
                    value={suggestedRetailPrice}
                    onChange={(e) => setSuggestedRetailPrice(e.target.value)}
                  />
                  <FormHelperText style={{ color: '#BD9F00' }}>{fieldWarning.suggestedRetailPrice}</FormHelperText>
                </Grid>

                {/* Date Picker For Expiration Date */}
                <Grid item xs={6}>
                  <StyledTextField
                    type="date"
                    label="Expiration Date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={expirationDate ? expirationDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setExpirationDate(new Date(e.target.value))}
                  />
                  <FormHelperText style={{ color: '#BD9F00' }}>{fieldWarning.expirationDate}</FormHelperText>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                    style={{
                      marginTop: '10px',
                      maxWidth: '400px',  // Set max width for better control
                      width: '90%',       // Ensure it stretches within the grid
                      marginLeft: 'auto',
                      marginRight: 'auto', // Center the button
                    }}
                  >
                    Add Product
                  </Button>
                </Grid>

              </Grid>
            </div>
          </div>
        </StyledCard>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} style={{ top: '85px' }}>
          <Alert onClose={handleCloseSnackbar} severity={alertSeverity as 'success' | 'error'} sx={{ width: '100%' }}>
            <AlertTitle>{alertTitle}</AlertTitle>
            {alertMessage}
          </Alert>
        </Snackbar>
      </StyleGrid>
    </div>
  );
}
