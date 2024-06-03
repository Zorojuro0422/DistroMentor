import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from "@emotion/styled";
import dealer1 from '../../Global Components/Images/dealer1-2.png';
import logo4 from '../../Global Components/Images/logo4.png';
import { Button, FormHelperText, Grid, TextField, Typography, Card, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";

interface Product {
  productid: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
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

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [fieldWarning, setFieldWarning] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      let url = 'http://localhost:8080/product/getAllProducts';

      // If search is not empty, it means we are searching by product ID
      if (search) {
        url += `/${encodeURIComponent(search)}`;
        const response = await axios.get(url);
        // Update the products state with a single product (assuming searching by product ID returns a single product)
        setProducts([response.data]);
      } else {
        // Otherwise, fetch all products
        const response = await axios.get(url);
        // Update the products state with the array of products
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      // Send a DELETE request to the endpoint with the productId
      await axios.delete(`http://localhost:8080/product/${productId}`);

      // After successful deletion, refetch the products
      fetchProducts();

      setAlertMessage('Product deleted successfully!');
      setAlertSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting product:', error);
      setAlertMessage('Error deleting product.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setOpenDialog(false);
      setSelectedProductId(null);
    }
  };

  const handleEdit = (productId: string) => {
    // Redirect to the update page with the productId
    window.location.href = `/update_product/${productId}`;
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenDialog = (productId: string) => {
    setSelectedProductId(productId);
    setOpenDialog(true);
  };

      const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProductId(null);
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
            <ContentNameTypography>Product List</ContentNameTypography>
            <div style={{ paddingTop: 30, paddingBottom: 50 }}>
              <Grid container spacing={3}>
                {/* Search Field */}
                <Grid item xs={12}>
                  <StyledTextField variant="outlined" label="Search by Product ID" style={{ width: '700px' }} value={search} onChange={(e) => setSearch(e.target.value)} />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning}
                  </FormHelperText>
                  <Button variant="contained" color="primary" onClick={fetchProducts} style={{ marginTop: '20px', width: '700px' }}>
                    Search
                  </Button>
                </Grid>
                <Grid item xs={12}>
                </Grid>
              </Grid>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', border: '2px solid black', backgroundColor: 'white' }}>
                <thead style={{ backgroundColor: '#f2f2f2' }}>
                  <tr>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Product ID</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Product Name</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Unit</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Price</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Quantity</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(products) && products.length > 0 && products.map((product) => (
                    <tr key={product.productid}>
                      <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>{product.productid}</td>
                      <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>{product.name}</td>
                      <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>{product.unit}</td>
                      <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>{product.price}</td>
                      <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>{product.quantity}</td>
                      <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333', display: 'flex', gap: '10px' }}>
                        <a href={`/update_product/${product.productid}`} style={{ color: 'green' }}>Edit</a>
                        <a href="#" onClick={() => handleOpenDialog(product.productid)} style={{ color: 'red' }}>Delete</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </StyledCard>
      </StyleGrid>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={alertSeverity} sx={{ width: '100%' }}>
          <AlertTitle>{alertSeverity === 'success' ? 'Success' : 'Error'}</AlertTitle>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Product"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => selectedProductId && handleDelete(selectedProductId)} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductList;
