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
  suggestedRetailPrice: number;
}

interface DealerProduct {
    dealerproductid: string;
    dealerid: string;
    productid: string;
    name: string;
    quantity: number;
    unit: string;
    price: number;
    suggestedRetailPrice: number;
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

  useEffect(() => {
    // Check stock levels after cart updates
    cart.forEach((product) => {
      if (product.quantity === 0) {
        setAlertMessage(`${product.name} is out of stock!`);
        setAlertSeverity("error");
        setOpenSnackbar(true);
      }
    });
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const dealerID = userFromStorage.dealer.dealerid; // Get dealer ID from user storage
      console.log("Fetching products for dealer ID:", dealerID); // Log the dealer ID for debugging

      // Fetch dealer products by dealer ID
      const response = await axios.get(`http://localhost:8080/api/dealer-products/dealer/${dealerID}`);

      console.log("API response:", response.data); // Log the full API response to check structure

      const dealerProducts = response.data; // Assuming response contains a list of dealer products directly

      // Map the response to the format needed
      const productMap: { [key: string]: Product } = {};

      dealerProducts.forEach((dealerProduct: any) => {
        const existingProduct = productMap[dealerProduct.productid]; // Match by productid

        if (existingProduct) {
          // If the product already exists in the map, add the quantities
          existingProduct.quantity += dealerProduct.quantity;
        } else {
          // Otherwise, add the new product to the map
          productMap[dealerProduct.productid] = {
            productid: dealerProduct.productid,
            name: dealerProduct.name,
            unit: dealerProduct.unit,
            price: dealerProduct.price,
            quantity: dealerProduct.quantity,
            selectedQuantity: 0, // Set initial selectedQuantity to 0
            suggestedRetailPrice: dealerProduct.suggestedRetailPrice || 0,
          };
        }
      });

      // Set the products state
      setProducts(Object.values(productMap)); // Convert the product map to an array
    } catch (error) {
      console.error("Error fetching products:", error); // Log the actual error message for debugging
      setAlertMessage("Error fetching products. Check the console for details.");
      setAlertSeverity("error");
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
      if (quantity > chosenProduct.quantity) {
        // Show a message if the quantity exceeds the available stock
        setAlertMessage(
          `Insufficient stock! Only ${chosenProduct.quantity} ${chosenProduct.unit} available of ${chosenProduct.name}.`
        );
        setAlertSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const existingProductIndex = cart.findIndex(
        (item) => item.productid === chosenProduct.productid
      );

      if (existingProductIndex !== -1) {
        const updatedCart = [...cart];
        const newSelectedQuantity =
          updatedCart[existingProductIndex].selectedQuantity + quantity;

        if (newSelectedQuantity > chosenProduct.quantity) {
          // Show a message if the total quantity in the cart exceeds the available stock
          setAlertMessage(
            `Insufficient stock! Only ${chosenProduct.quantity} ${chosenProduct.unit} available of ${chosenProduct.name}.`
          );
          setAlertSeverity("error");
          setOpenSnackbar(true);
          return;
        }

        updatedCart[existingProductIndex].selectedQuantity = newSelectedQuantity;
        setCart(updatedCart);
      } else {
        setCart([
          ...cart,
          { ...chosenProduct, selectedQuantity: quantity },
        ]);
      }

      setChosenProduct(null);
      setQuantity(0);
    } else {
      setAlertMessage("Please select a product and enter a valid quantity.");
      setAlertSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleRemoveFromCart = (product: Product) => {
    setCart(cart.filter(item => item.productid !== product.productid));
  };

  const handleUpdateQuantity = (product: Product, newQuantity: number) => {
    if (newQuantity > product.quantity) {
      setAlertMessage(
        `Insufficient stock! Only ${product.quantity} ${product.unit} available of ${product.name}.`
      );
      setAlertSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.productid === product.productid
        ? { ...item, selectedQuantity: newQuantity }
        : item
    );
    setCart(updatedCart);
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, product) => total + product.price * product.selectedQuantity, 0);
  };

  const calculateTotalSRP = () => {
      return cart.reduce((total, product) => total + product.suggestedRetailPrice * product.selectedQuantity, 0);
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
         deposit: 0,
         status: "Open",
         customer: selectedCustomer,
         orderedproducts: cart.map((product) => ({
             productid: product.productid,
             quantity: product.selectedQuantity,
             subtotal: product.price * product.selectedQuantity,
             totalsrp: product.suggestedRetailPrice * product.selectedQuantity,
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

         // Subtract the ordered quantity from the dealer product (Dealer's inventory)
         await Promise.all(
             cart.map(async (orderedProduct) => {
                 try {
                     // Fetch the dealer product by dealer ID and product ID
                     const dealerProductsResponse = await axios.get(
                         `http://localhost:8080/api/dealer-products/dealer/${dealerID}`
                     );

                     const dealerProducts: DealerProduct[] = dealerProductsResponse.data;

                     // Find the specific dealer product by productid
                     const existingDealerProduct = dealerProducts.find(
                         (dealerProduct: DealerProduct) => dealerProduct.productid === orderedProduct.productid
                     );

                     if (existingDealerProduct) {
                         // Subtract the ordered quantity from the dealer product quantity
                         const updatedQuantity = existingDealerProduct.quantity - orderedProduct.selectedQuantity;

                         // Update the dealer product with the new quantity
                         await axios.put(`http://localhost:8080/api/dealer-products/${existingDealerProduct.dealerproductid}`, {
                             ...existingDealerProduct,
                             quantity: updatedQuantity, // Update the quantity
                         });
                     } else {
                         console.error('Dealer product not found for product ID:', orderedProduct.productid);
                     }
                 } catch (error) {
                     console.error('Error updating dealer product quantity:', error);
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
                        <RemoveButton onClick={() => handleRemoveFromCart(product)}><RemoveCircleIcon style={{ color: "red" }}></RemoveCircleIcon></RemoveButton>
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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        style={{ top: '85px' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <ToastContainer
        position="top-center"
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
