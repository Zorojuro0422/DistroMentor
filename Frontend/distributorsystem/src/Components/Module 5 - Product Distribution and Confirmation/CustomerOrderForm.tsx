import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import styled from "@emotion/styled";
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { Grid, TextField, Typography, Paper, Button, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Autocomplete, Box, Alert } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  productid: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  selectedQuantity: number;
}

interface Customer {
  customerID: string;
  firstName: string;
  lastName: string;
}

const OverallGrid = styled(Grid)({
  position: 'relative',
  display: "flex",
  justifyContent: "center",
  top: 50
});

const PaperStyle = styled(Paper)({
  background: 'linear-gradient(50deg, rgba(255,255,255,0.4) 12%,rgba(255,255,255,0.1) 77% )',
  backdropFilter: 'blur(5px)',
  WebkitBackdropFilter: 'blur(5px)',
  boxShadow: '0 3px 3px 1px rgba(0,0,0,0.28)',
  borderRadius: "10px",
  height: "200px",
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  width: '1200px',
  marginTop: 30
});

const ProductName = styled(Typography)({
  position: 'relative',
  left: 30,
  top: -50
});

const QuantityName = styled(Typography)({
  position: 'relative',
  left: -20,
  top: -50
});

const StyledProductField = styled(TextField)({
  position: 'relative',
  width: '400px',
  left: -70,
  [`& fieldset`]: {
    borderRadius: 20
  }
});

const StyledQuantityField = styled(TextField)({
  position: 'relative',
  width: '400px',
  left: -80,
  [`& fieldset`]: {
    borderRadius: 20
  }
});

const AddToCart = styled(Button)({
  position: 'relative',
  width: '200px',
  height: 50,
  left: -30,
  ':hover': {
    backgroundColor: '#2D85E7',
    transform: 'scale(1.1)'
  },
  transition: 'all 0.4s'
});

const SaveButton = styled(Button)({
  backgroundColor: 'rgb(45, 133, 231,0.8)',
  borderRadius: 5,
  color: '#FFFFFF',
  fontFamily: 'Inter, sans-serif',
  fontSize: '20px',
  width: '200px',
  height: 50,
  ':hover': {
      backgroundColor: '#2D85E7',
      transform: 'scale(1.1)'
  },
  transition: 'all 0.4s'
});

const StyledNumber = styled(TextField)({
  '& fieldset': {
    borderColor: 'rgb(0,0,0,0)',
  },
});

const RemoveButton = styled(Button)({
  ":hover": {
    transform: 'scale(1.4)'
  },
  transition: 'all 0.4s'
});

const TableHeaderCell = styled(TableCell)({
  fontSize: 15,
  color: "#000000",
  fontWeight: "bold"
});

const CustomerDropdownPaper = styled(Paper)({
  backgroundColor: '#fff',
  borderRadius: "10px",
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  width: '1200px',
  marginTop: 30,
  padding: '20px'
});

const OrderingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [chosenProduct, setChosenProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [cart, setCart] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [distributionDate, setDistributionDate] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const userFromStorage = JSON.parse(localStorage.getItem("user")!);
  const dealerID = userFromStorage.dealer.dealerid;

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchProducts = async () => {
    try {
      const dealerID = userFromStorage.dealer.dealerid;
      const response = await axios.get(`http://localhost:8080/order/getAllConfirmedOrdersByDealerId/${dealerID}`);
      const orders = response.data;

      const productMap: { [key: string]: Product } = {};
      orders.forEach((order: any) => {
        order.orderedproducts.forEach((orderedProduct: any) => {
          const product = orderedProduct.product;
          const existingProduct = productMap[product.productid];

          if (existingProduct) {
            existingProduct.quantity += orderedProduct.quantity;
          } else {
            productMap[product.productid] = {
              productid: product.productid,
              name: product.name,
              unit: product.unit,
              price: product.price,
              quantity: orderedProduct.quantity,
              selectedQuantity: 0,
            };
          }
        });
      });

      setProducts(Object.values(productMap));
    } catch (error) {
      console.error('Error fetching products:', error);
      setAlertMessage('Error fetching products.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const fetchCustomers = async () => {
    try {
      const dealerID = userFromStorage.dealer.dealerid;
      const response = await axios.get(`http://localhost:8080/customer/dealer/${dealerID}`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setAlertMessage('Error fetching customers.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleQuantityChange = (productid: string, quantity: number) => {
    setProducts(products.map(product =>
      product.productid === productid ? { ...product, selectedQuantity: quantity } : product
    ));
  };

  const handleAddToCart = () => {
    if (chosenProduct && quantity > 0) {
      const existingProductIndex = cart.findIndex(item => item.productid === chosenProduct.productid);

      if (existingProductIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingProductIndex].selectedQuantity += quantity;
        setCart(updatedCart);
      } else {
        setCart([...cart, { ...chosenProduct, selectedQuantity: quantity }]);
      }

      setChosenProduct(null);
      setQuantity(0);
    } else {
      setAlertMessage('Please select a product and enter a quantity.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleRemoveFromCart = (product: Product) => {
    setCart(cart.filter(item => item.productid !== product.productid));
  };

  const handleUpdateQuantity = (product: Product, newQuantity: number) => {
    const updatedCart = cart.map((item) =>
      item.productid === product.productid ? { ...item, selectedQuantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, product) => total + product.price * product.selectedQuantity, 0);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

 const handleSaveOrder = async () => {
     if (!selectedCustomer || !distributionDate || cart.length === 0) {
         setAlertMessage('Please select a customer, enter a distribution date, and select products.');
         setAlertSeverity('error');
         setOpenSnackbar(true);
         return;
     }

     const order = {
         orderid: uuidv4().slice(0, 8),
         customerid: selectedCustomer.customerID,
         dealerid: dealerID,
         distributiondate: distributionDate,
         orderdate: moment().format('YYYY-MM-DD'),
         orderamount: calculateTotalPrice(),
         customer: selectedCustomer,
         orderedproducts: cart.map((product) => ({
             productid: product.productid,
             quantity: product.selectedQuantity,
             subtotal: product.price * product.selectedQuantity,
             product: {
                 productid: product.productid,
                 name: product.name,
                 unit: product.unit,
                 price: product.price,
                 quantity: product.quantity,
             },
         })),
     };

     try {
         const response = await axios.post('http://localhost:8080/customerOrder/newOrder', order);
         console.log('Order response:', response.data);
         setAlertMessage('Order saved successfully.');
         setAlertSeverity('success');
         setOpenSnackbar(true);

         // Subtract the ordered quantity from the available quantity
         await Promise.all(
             cart.map(async (orderedProduct) => {
                 try {
                     await axios.put(`http://localhost:8080/product/${orderedProduct.productid}`, {
                         quantity: orderedProduct.quantity - orderedProduct.selectedQuantity,
                     });
                 } catch (error) {
                     console.error('Error updating product quantity:', error);
                 }
             })
         );

         // Clear the cart and reset other states
         setCart([]);
         setSelectedCustomer(null);
         setDistributionDate('');
     } catch (error) {
         const axiosError = error as AxiosError;
         console.error('Error saving order:', axiosError);
         setAlertMessage('Error saving order. Please check the console for details.');
         setAlertSeverity('error');
         setOpenSnackbar(true);
     }
 };





  return (
    <div>
      <OverallGrid container direction="column" alignItems="center">
        <Grid item>
          <CustomerDropdownPaper>
            <Autocomplete
              id="customer-select"
              options={customers}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              isOptionEqualToValue={(option, value) => option.customerID === value.customerID}
              value={selectedCustomer}
              onChange={(event, newValue) => setSelectedCustomer(newValue)}
              renderInput={(params) => (
                <StyledProductField
                  {...params}
                  variant='outlined'
                  label="Customer"
                  InputProps={{ ...params.InputProps, disableUnderline: true }}
                />
              )}
            />
            <StyledProductField
              variant="outlined"
              label="Distribution Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={distributionDate}
              onChange={(e) => setDistributionDate(e.target.value)}
              sx={{ marginLeft: 2 }}
            />
          </CustomerDropdownPaper>
        </Grid>
      </OverallGrid>
      <Grid item container sx={{ display: "flex", justifyContent: "center", marginTop: '30px' }}>
        <Grid item>
          <PaperStyle>
            <ProductName>Product Name</ProductName>
            <Autocomplete
              disablePortal
              id="product-select"
              options={products}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.productid === value.productid}
              value={chosenProduct}
              onChange={(event, newValue) => setChosenProduct(newValue)}
              renderInput={(params) => (
                <StyledProductField
                  {...params}
                  variant='outlined'
                  InputProps={{ ...params.InputProps, disableUnderline: true }}
                />
              )}
            />
            <QuantityName>Quantity</QuantityName>
            <StyledQuantityField
              variant="outlined"
              InputProps={{ disableUnderline: true }}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            />
            <AddToCart variant="contained" onClick={handleAddToCart}>
              ADD TO CART<AddShoppingCartIcon style={{ paddingLeft: 10, height: 22 }} />
            </AddToCart>
          </PaperStyle>
        </Grid>
      </Grid>
      <Grid item container spacing={4} sx={{ display: "flex", justifyContent: "center", marginTop: '10px' }}>
        <Grid item>
          <Paper sx={{ backgroundColor: '#ffffff', borderRadius: "10px", width: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'none' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell align="center" sx={{ color: '#707070', fontWeight: 550 }}>Available Quantity</TableHeaderCell>
                    <TableHeaderCell align="center" sx={{ color: '#707070', fontWeight: 550 }}>Quantity</TableHeaderCell>
                    <TableHeaderCell align="center" sx={{ color: '#707070', fontWeight: 550 }}>Unit</TableHeaderCell>
                    <TableHeaderCell align="center" sx={{ color: '#707070', fontWeight: 550 }}>Product Name</TableHeaderCell>
                    <TableHeaderCell align="center" sx={{ color: '#707070', fontWeight: 550 }}>Unit Price</TableHeaderCell>
                    <TableHeaderCell align="center" sx={{ color: '#707070', fontWeight: 550 }}>Amount</TableHeaderCell>
                    <TableHeaderCell align="center" sx={{ color: '#707070', fontWeight: 550 }}></TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((product) => (
                    <TableRow key={product.productid}>
                      <TableCell align="center">{product.quantity}</TableCell>
                      <TableCell align="center">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                          <StyledNumber
                            type="number"
                            value={product.selectedQuantity}
                            onChange={(e) => handleUpdateQuantity(product, parseInt(e.target.value))}
                          />
                        </div>
                      </TableCell>
                      <TableCell align="center">{product.unit}</TableCell>
                      <TableCell align="center">{product.name}</TableCell>
                      <TableCell align="center">{product.price}</TableCell>
                      <TableCell align="center">{product.price * product.selectedQuantity}</TableCell>
                      <TableCell align="center">
                        <RemoveButton onClick={() => handleRemoveFromCart(product)}>
                          <RemoveCircleIcon />
                        </RemoveButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <br />
          <Paper sx={{ width: '200px', display: 'flex', marginLeft: 'auto', alignContent: 'center' }}>
            <Typography sx={{ fontSize: 15, color: "#000000", fontWeight: "bold" }}>Total Amount:</Typography>
            <Typography>Php {calculateTotalPrice()}</Typography>
          </Paper>
          <br />
        </Grid>
      </Grid>
      <SaveButton variant='contained' onClick={handleSaveOrder} disabled={!selectedCustomer || !distributionDate}>Save</SaveButton>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        limit={3}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ width: 430 }}
        theme="colored"
      />
    </div>
  );
};

export default OrderingPage;
