import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from "@emotion/styled";
import dealer1 from '../../Global Components/Images/dealer1-2.png';
import logo4 from '../../Global Components/Images/logo4.png';
import { Button, Autocomplete, FormHelperText, Grid, TextField, Typography, Card, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Alert } from "@mui/material";

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

const EditButton = styled(Button)({
  backgroundColor: '#4CAF50',
  color: 'white',
  width: '50px',
  height: '25px',
  marginRight: '10px',
  ':hover': {
    backgroundColor: '#45a049',
    transform: 'scale(1.1)'
  },
  transition: 'all 0.4s'
});

const DeleteButton = styled(Button)({
  backgroundColor: '#f44336',
  color: 'white',
  width: '50px',
  height: '25px',
  ':hover': {
    backgroundColor: '#e53935',
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5); // 5 rows per page

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/product/getAllProducts');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:8080/product/${productId}`);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Calculate pagination details
  const totalPages = Math.ceil(products.length / rowsPerPage);
  const currentProducts = selectedProduct ? [selectedProduct] : products.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Add empty rows to fill the remaining space
  const emptyRows = rowsPerPage - currentProducts.length;

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
                  <Autocomplete
                    options={products}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setSelectedProduct(newValue); // Update selected product state
                      } else {
                        setSelectedProduct(null); // Reset selected product
                      }
                    }}
                    renderInput={(params) => (
                      <StyledTextField
                        {...params}
                        label="Search by Product Name"
                        variant="outlined"
                        style={{ width: '700px' }}
                      />
                    )}
                  />
                  <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                    {fieldWarning}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}></Grid>
              </Grid>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', border: '2px solid black', backgroundColor: 'white' }}>
                <thead style={{ backgroundColor: '#53A0F7' }}>
                  <tr>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Product ID</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Product Name</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Unit</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Price</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Quantity</th>
                    <th style={{ border: '1px solid black', padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(currentProducts) && currentProducts.length > 0 && currentProducts.map((product) => (
                    <tr key={product.productid}>
                      <td style={{ border: '1px solid black', padding: '10px', fontWeight: 'bold', color: '#333' }}>{product.productid}</td>
                      <td style={{ border: '1px solid black', padding: '10px', fontWeight: 'bold', color: '#333' }}>{product.name}</td>
                      <td style={{ border: '1px solid black', padding: '10px', fontWeight: 'bold', color: '#333' }}>{product.unit}</td>
                      <td style={{ border: '1px solid black', padding: '10px', fontWeight: 'bold', color: '#333' }}>{product.price}</td>
                      <td style={{ border: '1px solid black', padding: '10px', fontWeight: 'bold', color: '#333' }}>{product.quantity}</td>
                      <td style={{ border: '1px solid black', padding: '10px', textAlign: 'center' }}>
                        <EditButton onClick={() => handleEdit(product.productid)}>
                          Edit
                        </EditButton>
                        <DeleteButton onClick={() => handleOpenDialog(product.productid)}>
                          Delete
                        </DeleteButton>
                      </td>
                    </tr>
                  ))}
                  {/* Fill the table with empty rows if less than 5 products on current page */}
                  {emptyRows > 0 && Array.from(Array(emptyRows)).map((_, index) => (
                    <tr key={`empty-${index}`}>
                      <td style={{ border: '1px solid black', padding: '10px', color: '#333' }}>&nbsp;</td>
                      <td style={{ border: '1px solid black', padding: '10px', color: '#333' }}>&nbsp;</td>
                      <td style={{ border: '1px solid black', padding: '10px', color: '#333' }}>&nbsp;</td>
                      <td style={{ border: '1px solid black', padding: '10px', color: '#333' }}>&nbsp;</td>
                      <td style={{ border: '1px solid black', padding: '10px', color: '#333' }}>&nbsp;</td>
                      <td style={{ border: '1px solid black', padding: '10px', color: '#333' }}>&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              {!selectedProduct && (
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                  disabled={currentPage === 1}
                  style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'transform 0.1s ease, box-shadow 0.1s ease', boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)' }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Prev
                </button>
                <span style={{ margin: '0 15px', fontWeight: 'bold', paddingTop: '8px' }}>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'transform 0.1s ease, box-shadow 0.1s ease', boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)' }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Next
                </button>
              </div>
              )}
              </div>
            </div>
          </StyledCard>
        </StyleGrid>
    <Snackbar
      open={openSnackbar}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      style={{ top: '85px' }} // Adjust this value to control how far from the top
    >
      <Alert onClose={handleCloseSnackbar} severity={alertSeverity}>
        {alertMessage}
      </Alert>
    </Snackbar>
      {/* Confirmation dialog for delete */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => selectedProductId && handleDelete(selectedProductId)} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductList;
