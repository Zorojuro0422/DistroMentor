import { Box, Button, Grid, IconButton, InputAdornment, InputLabel, TextField, Typography, styled, Paper, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TextFieldProps, MenuItem, Autocomplete, Snackbar, Alert, AlertTitle, Slide, SlideProps, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useParams } from 'react-router-dom';  // Import useParams here
import { useRestOrder } from '../../RestCalls/OrderUseRest';
import { useRestDealer } from '../../RestCalls/DealerUseRest';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import moment from 'moment';
import { IOrder, IOrderedProducts, IProduct, DealerProduct, PaymentRecord } from '../../RestCalls/Interfaces';
import { v4 as uuidv4 } from 'uuid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useEffect, useRef, useState } from 'react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RemoveButton = styled(Button)({
  ":hover": {
    transform: 'scale(1.4)'
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
const StyledDatePicker = styled(DatePicker)({
  [`& fieldset`]: {
    borderRadius: 20,
    height: 55,
  }
});
const StyledNumber = styled(TextField)({
  '& fieldset': {
    borderColor: 'rgb(0,0,0,0)', // Change 'your-color' to the desired color
  },
});
const StyledProductTextField = styled(TextField)({
  backgroundColor: "#AFD3E2", borderRadius: "22px", input: {
    padding: "10px", color: "black"
  },
  width: '200px',
});
const PaperStyle = styled(Paper)({
  background: 'linear-gradient(50deg, rgba(255,255,255,0.4) 12%,rgba(255,255,255,0.1) 77% )',
  backgroundBlendMode: '',
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

const StyledTextField = styled(TextField)({
  input: {
    marginTop: "-3px"
  },
  [`& fieldset`]: {
    borderRadius: 20,
    height: 53,
  }
});

const LabelGrid = styled(Grid)({
  position: 'relative',
  display: "flex",
  justifyContent: "center",
  top: 20,
});

const TableHeaderCell = styled(TableCell)({
  fontSize: 15,
  color: "#000000",
  fontWeight: "bold"
});

const ProductName = styled(Typography)({
  color: '#707070',
  fontWeight: '550',
  position: 'relative',
  left: 30,
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
const QuantityName = styled(Typography)({
  color: '#707070',
  fontWeight: '550',
  position: 'relative',
  left: -20,
  top: -50
});
const StyledQuantityField = styled(TextField)({
  position: 'relative',
  width: '400px',
  left: -80,
  [`& fieldset`]: {
    borderRadius: 20
  }
});

const TitleTypo = styled(Typography)({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 'bolder',
  textAlign: 'left',
  fontSize: '40px',
  color: '#203949'
});

const TitleBox = styled(Box)({
  position: 'relative',
  display: "flex",
  justifyContent: "center",
  top: 20,
  bottom: -10,
  left: -350,
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
const OverallGrid = styled(Grid)({
  position: 'relative',
  display: "flex",
  justifyContent: "center",
  paddingTop: 30
});
const StyleLabel = styled(Typography)({
  textAlign: 'left',
  fontWeight: '550',
  marginLeft: 0,
  marginTop: 20,
  paddingBottom: 10,
  color: '#707070',
  fontSize: '18px',
  width: 'max-content',
  fontFamily: 'Inter',
});
const StyleData = styled(Typography)({
  textAlign: 'left',
  width: 250,
  marginLeft: 0,
  marginTop: 15,
  color: '#203949',
  fontSize: '17px',
  fontFamily: 'Inter, sans - serif',
});

export default function OrderConfirmation() {
  const { objectId } = useParams();

  const [openDialog, setOpenDialog] = useState(false);
  const [newOrder, getOrderByID, getOrderByPaymentTransactionID, assignCollector, removeCollector, order, orderFromPaymentTransaction, isOrderFound, assignedStatus, removeStatus, updateOrder, closedOrder, applyPenalty] = useRestOrder();

  const [getDealerByID, getDealerByDistributor, newDealer, confirmDealer, markDealerAsPending, declineDealer, updateDealerCreditLimit, resetDealer, isDealerFound, isDealerConfirmed, dealer, dealerRemainingCredit] = useRestDealer();

  const [tableData, setTableData] = useState<{ quantity: number; productName: string; productPrice: number; productUnit: string; productCommissionRate: number; productAmount: number; }[]>([]);

  const [products, setProducts] = useState<IProduct[]>([]);

  const [orderedProducts, setOrderedProducts] = useState<IOrderedProducts[]>([]);

  const [orderedProducts1, setOrderedProducts1] = useState<IOrderedProducts[]>([]);

  const [chosenProduct, setChosenProduct] = useState<IProduct | null>(null);

  const [paymentTerm, setPaymentTerm] = useState(0);

  const [totalAmount, setTotalAmount] = useState(0);

  const [quantity, setQuantity] = useState<string>('');

  const [minDate, setMinDate] = useState<Dayjs | null>(null);

  const [alerttitle, setTitle] = useState('');

  const [alertMessage, setAlertMessage] = useState('');

  const [alertSeverity, setAlertSeverity] = useState('success');

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const quantityRef = useRef<TextFieldProps>(null);
  const penaltyRateRef = useRef<TextFieldProps>(null);
  const dealerIDRef = useRef<TextFieldProps>(null);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  function SlideTransitionDown(props: SlideProps) {
    return <Slide {...props} direction="down" />;
  }

  const [isMounted, setIsMounted] = useState(false);

  const userFromStorage = JSON.parse(localStorage.getItem("user")!);

  const handleFindOrder = () => {
    if (userFromStorage && userFromStorage.tableName === 'Sales Associate') {
      getOrderByID(objectId!, userFromStorage.salesAssociate.distributor.distributorid);
    }
    else if (userFromStorage && userFromStorage.tableName === 'Sales Associate and Cashier') {
      getOrderByID(objectId!, userFromStorage.salesAssociateAndCashier.distributor.distributorid);
    }
    else {
      getOrderByID(objectId!, userFromStorage.distributor.distributorid);
    }
  };

  const fetchPaymentRecords = () => {
      axios
        .get(`https://distromentor.onrender.com/payment-records/order/${order?.orderid}`)
        .then((response) => {
          console.log("Fetched Payment Records for Order ID:", order?.orderid);
          console.log("Payment Records:", response.data); // Log the entire data
          setPaymentRecords(response.data); // Store the fetched data
        })
        .catch((error) => {
          console.error("Error fetching payment records:", error);
        });
    };

    useEffect(() => {
      if (order?.orderid) {
        fetchPaymentRecords();
      }
    }, [order?.orderid]);


  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleOpenAddOrderDialog = () => {
      setOpenDialog(true);
    };

    // Handle Payment Schedule dialog open
    const handleOpenPaymentDialog = () => {
      setOpenPaymentDialog(true);
      fetchPaymentRecords(); // Fetch payment records when opening the payment dialog
    };

  const handleClickClose = () => {
      setOpenDialog(false);
    };

  function saveHandleAlert(title: string, message: string, severity: 'success' | 'warning' | 'error') {
    setTitle(title);
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpen(true);
  }

  function getProductsByDistributor() {
    const distributorId = userFromStorage.distributor.distributorid; // Use the distributor ID from storage
    axios.get<IProduct[]>(`https://distromentor.onrender.com/product/getProductsByDistributor/${distributorId}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error retrieving products:', error);
      });
  }

  const [isDataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      getProductsByDistributor();  // Fetch products by distributor
      handleFindOrder();
      setDataFetched(true); // Set the flag to true to prevent re-fetching
    }

    setOrderedProducts(order?.orderedproducts!);
    setTotalAmount(order?.orderamount!);
    setMinDate(dayjs() as Dayjs);
  }, [order, isDataFetched]);

  const handleAddToCart = () => {
    if (chosenProduct) {
      const uuid = uuidv4();
      const orderedproductuuid = uuid.slice(0, 8);
      const existingProductIndex = orderedProducts.findIndex(
        (item) => item.product.productid === chosenProduct.productid
      );

      if (existingProductIndex !== -1) {
        toast.info("If you'd like to increase the quantity of products, adjust product quantity as needed.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        toast.warning(chosenProduct.name + ' is already been added to the cart', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setChosenProduct(null);
        setQuantity('');
      } else {
        const newOrderedProduct: IOrderedProducts = {
          orderedproductid: orderedproductuuid,
          product: chosenProduct,
          quantity: Number(quantity),
          subtotal: chosenProduct.price * Number(quantity),
          totalsrp: chosenProduct.suggestedRetailPrice * Number(quantity),
        };

        const updatedOrderedProducts = [...orderedProducts, newOrderedProduct];

        const orderAmount = updatedOrderedProducts.reduce((total, product) => {
          return total + product.product.price * product.quantity;
        }, 0);

        setTotalAmount(orderAmount);
        setOrderedProducts(updatedOrderedProducts);
        setChosenProduct(null);
        setQuantity('');
        toast.success(chosenProduct.name + ' is added to the cart', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };

  const handleUpdateQuantity = (product: IOrderedProducts, updatedQuantity: number) => {
    const updatedProducts = orderedProducts.map((item) => {
      if (item.product.productid === product.product.productid) {
        return { ...item, quantity: updatedQuantity };
      }
      return item;
    });
    setOrderedProducts(updatedProducts);
  };

  const handleRemoveFromCart = (product: IOrderedProducts) => {
    const updatedProducts = orderedProducts.filter(
      (item) => item.product.productid !== product.product.productid
    );
    setOrderedProducts(updatedProducts);
    toast(
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <RemoveCircleIcon fontSize='medium' style={{ marginRight: '10px', alignItems: '' }} />
        {product.product.name + ' has been removed from the cart'}
      </div>, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: { backgroundColor: '#FA9600', color: '#ffffff' },
      theme: "colored",
    });
  };

  const clearInputValues = () => {
    setOrderedProducts([]);
    setPaymentTerm(0);
    setTotalAmount(0);

    if (penaltyRateRef.current?.value) {
      penaltyRateRef.current!.value = '';
    }
  };

  const handleSaveOrder = async () => {
    const currentDate = dayjs().format('YYYY-MM-DD'); // Get the current date

    if (orderedProducts.length > 0) {
      const existingOrderId = order?.orderid;

      const orderAmount = orderedProducts.reduce((total, product) => {
        return total + product.product.price * product.quantity;
      }, 0);
      const orderAmountSRP = orderedProducts.reduce((total, product) => total + product.totalsrp, 0);

      // Retain existing payment terms and penalty rate if available
      const existingPaymentTerms = order?.paymentterms || 0; // Use existing value or default to 0
      const existingPenaltyRate = order?.penaltyrate || 0; // Use existing value or default to 0

      const updatedOrder: IOrder = {
        orderid: existingOrderId!,
        distributiondate: currentDate, // Automatically set to today's date
        orderdate: moment().format('YYYY-MM-DD'),
        penaltyrate: Number(penaltyRateRef.current?.value) || existingPenaltyRate, // Use new value or retain existing
        paymentterms: paymentTerm || existingPaymentTerms, // Use new value or retain existing
        orderamount: orderAmount,
        amount: orderAmount,
        orderamountsrp: orderAmountSRP,
        distributor: dealer?.distributor!,
        collector: null,
        dealer: dealer!,
        orderedproducts: orderedProducts,
        paymenttransactions: [],
        confirmed: true,
        status: 'Open',
        deposit: 0,
      };

      try {
        // Update the order first
        await updateOrder(existingOrderId, updatedOrder);

        // Update product quantities for each ordered product
        const updateProductQuantities = orderedProducts.map(async (orderedProduct) => {
          try {
            const product = orderedProduct.product;
            const response = await axios.get<IProduct>(`https://distromentor.onrender.com/product/getAllProducts/${product.productid}`);
            const existingQuantity = response.data.quantity;

            const updatedQuantity = existingQuantity - orderedProduct.quantity;

            // Update the product with the new quantity
            await axios.put(`https://distromentor.onrender.com/product/${product.productid}`, {
              name: product.name,
              quantity: updatedQuantity,
              unit: product.unit,
              price: product.price,
            });

            // Fetch dealer products to check if the product already exists for the dealer
            const dealerProductsResponse = await axios.get<DealerProduct[]>(
              `https://distromentor.onrender.com/api/dealer-products/dealer/${order?.dealer.dealerid}`
            );

            const existingDealerProduct = dealerProductsResponse.data.find(
              (dealerProduct: DealerProduct) => dealerProduct.productid === product.productid
            );

            if (existingDealerProduct) {
              // If the product exists, update the quantity by adding the new quantity
              const newQuantity = existingDealerProduct.quantity + orderedProduct.quantity;
              await axios.put(
                `https://distromentor.onrender.com/api/dealer-products/${existingDealerProduct.dealerproductid}`,
                {
                  dealerproductid: existingDealerProduct.dealerproductid,
                  dealerid: existingDealerProduct.dealerid,
                  productid: existingDealerProduct.productid,
                  name: existingDealerProduct.name,
                  quantity: newQuantity, // Update the quantity
                  unit: existingDealerProduct.unit,
                  price: existingDealerProduct.price,
                  suggestedRetailPrice: existingDealerProduct.suggestedRetailPrice || 0, // Suggested retail price
                  expirationDate: existingDealerProduct.expirationDate, // Product expiration date
                }
              );
            } else {
              // If the product doesn't exist, create a new dealer product
              const dealerProductPayload = {
                dealerproductid: uuidv4().slice(0, 8), // Autogenerate dealer product ID
                dealerid: order?.dealer.dealerid!, // Get dealer ID
                productid: product.productid, // Pass the product ID here
                name: product.name, // Product name
                quantity: orderedProduct.quantity, // Product quantity
                unit: product.unit, // Product unit
                price: product.price, // Product price
                suggestedRetailPrice: product.suggestedRetailPrice || 0,
                expirationDate: product.expirationDate,
              };

              // Post the new dealer product to the API
              await axios.post('https://distromentor.onrender.com/api/dealer-products', dealerProductPayload);
            }
          } catch (error) {
            console.error('Error updating product quantity or posting dealer product:', error);
          }
        });

        // Ensure all product quantity updates and dealer product posts are completed
        await Promise.all(updateProductQuantities);

        // Post the AllProductSubtotal after confirming the order
        await axios.post('https://distromentor.onrender.com/allProductSubtotals/saveOrUpdate', {
          dealerid: order?.dealer.dealerid!, // Make sure this dealerid exists and is correct
          totalProductSubtotal: orderAmount, // Pass the subtotal (orderAmount) here
        });

        // Show success message and clear inputs
        saveHandleAlert('Success Saving Order', "The Dealer's ordered products have been successfully updated & confirmed!", 'success');
        clearInputValues();
        navigate('/productDistributionList');
      } catch (error) {
        // Handle errors during order update or product posting
        saveHandleAlert('Error Saving Order', "An error occurred while saving the order. Please try again.", 'error');
        console.error('Error updating order:', error);
      }
    } else {
      saveHandleAlert('Cart is Empty.', "Order hasn't been confirmed because cart is empty. Add a product before confirming order", 'error');
    }
  };

  return (
    <div>
      <OverallGrid container>
        <Box sx={{ pl: 7 }}>
          <LabelGrid>
            <Grid item style={{ marginRight: -110 }} paddingBottom={2}>
              <StyleLabel>Order ID</StyleLabel>
              <StyleData>{order?.orderid}</StyleData>
            </Grid>
            <Grid item style={{ marginRight: -110 }} paddingBottom={2}>
              <StyleLabel>Dealer ID</StyleLabel>
              <StyleData>{order?.dealer.dealerid}</StyleData>
            </Grid>
            <Grid item style={{ marginRight: -75 }} paddingBottom={2}>
              <StyleLabel>Dealer Name</StyleLabel>
              <StyleData>{order?.dealer.firstname + " " + order?.dealer.middlename + " " + order?.dealer.lastname}</StyleData>
            </Grid>
            <Grid item paddingRight={30} paddingBottom={2}>
              <StyleLabel>Distribution Date</StyleLabel>
              <Typography sx={{ fontSize: 17, color: '#203949', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>{dayjs().format('YYYY-MM-DD')}</Typography>
            </Grid>
          </LabelGrid>
          <Grid item paddingLeft={85}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenPaymentDialog}
              sx={{
                marginTop: -10, // Adjust the value to move the button up
              }}
            >
              Payment Schedule
            </Button>
          </Grid>
        </Box>

        <Grid item container spacing={4} sx={{ display: "flex", justifyContent: "center", marginTop: '10px' }}>
          <Grid item >
            <Paper sx={{ backgroundColor: '#ffffff', borderRadius: "10px", width: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'none' }}>
              <TableContainer>
                <Table style={{ backgroundColor: 'rgb(45, 133, 231, 0.08)' }}>
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
                    {orderedProducts?.map((product, index) => (
                      <TableRow sx={{ backgroundColor: index % 2 === 0 ? 'inherit' : 'rgb(45, 133, 231, 0.08)' }} key={product.product.productid}>
                        <TableCell align='center' sx={{ color: "#156D94" }}>
                          <StyledNumber
                            variant="outlined"
                            type='number'
                            value={product.quantity}
                            style={{ width: 90 }}
                            onChange={(e) => {
                              const newValue = Number(e.target.value);
                              if (newValue < 0) {
                                handleUpdateQuantity(product, 0);
                              } else {
                                handleUpdateQuantity(product, newValue);
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell align='center' sx={{ color: "#203949" }}>{product.product.unit}</TableCell>
                        <TableCell align='center' sx={{ color: "#203949" }}>{product.product.name}</TableCell>
                        <TableCell align='center' sx={{ color: "#203949" }}>{product.product.price}</TableCell>
                        <TableCell align='center' sx={{ color: "#203949" }}>{product.product.price * product.quantity}</TableCell>
                        <TableCell align='center' sx={{ color: "#203949" }}><RemoveButton onClick={() => handleRemoveFromCart(product)}><RemoveCircleIcon style={{ color: "red" }}></RemoveCircleIcon></RemoveButton></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            <br></br>
            <Paper sx={{ width: '220px', height: '40px', display: 'flex', marginLeft: 'auto', alignContent: 'center', paddingTop: 2, paddingLeft: 2 }}><Typography sx={{ fontSize: 15, color: "#000000", fontWeight: "bold" }}>Total Amount: ₱ {totalAmount}</Typography></Paper>
            <br></br>
          </Grid>
        </Grid>

        <Grid item container sx={{ display: "flex", justifyContent: "center", marginTop: '10px' }}>
          <Grid item>
            <SaveButton variant='contained' onClick={handleSaveOrder} sx={{ marginRight: 2 }}>Confirm</SaveButton>
            <SaveButton variant="contained" onClick={() => setOpenDialog(true)}>Add Order</SaveButton>
          </Grid>
        </Grid>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            style: {
              overflow: 'visible',
              maxWidth: '80vw',
              padding: '20px'
            }
          }}
        >
          <DialogTitle>
              <Typography sx={{ fontSize: '30px', fontFamily: 'Inter', fontWeight: '550' }}>
                Add Order
              </Typography>
          </DialogTitle>
          <DialogContent dividers={false} sx={{ overflow: 'visible' }}>
            <Grid item container sx={{ display: "flex", justifyContent: "center", marginTop: '10px' }}>
              <Grid item>
                <PaperStyle>
                  <ProductName>Product Name</ProductName>
                  <Autocomplete
                    disablePortal
                    id="flat-demo"
                    options={products}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.productid === value.productid}
                    value={chosenProduct}
                    onChange={(event, newValue) => setChosenProduct(newValue!)}
                    renderInput={(params) => (
                      <StyledProductField {...params} variant='outlined' InputProps={{
                        ...params.InputProps, disableUnderline: true
                      }}
                    />)}
                  />
                  <QuantityName>Quantity</QuantityName>
                  <StyledQuantityField
                    variant="outlined"
                    InputProps={{ disableUnderline: true }}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <AddToCart variant="contained" onClick={handleAddToCart}>
                    ADD TO CART<AddShoppingCartIcon style={{ paddingLeft: 10, height: 22 }} />
                  </AddToCart>
                </PaperStyle>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} variant="outlined" color="error">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog containing Payment Records */}
              <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} fullWidth>
                <DialogTitle>Payment Schedule</DialogTitle>
                <DialogContent>
                  {/* Table to display the payment records */}
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: '#f5f5f5', // Gray background color
                        }}
                      >
                        <TableCell align="center" sx={{ color: '#555', fontWeight: 'bold' }}>
                          Payment ID
                        </TableCell>
                        <TableCell align="center" sx={{ color: '#555', fontWeight: 'bold' }}>
                          Due Date
                        </TableCell>
                        <TableCell align="center" sx={{ color: '#555', fontWeight: 'bold' }}>
                          Amount
                        </TableCell>
                        <TableCell align="center" sx={{ color: '#555', fontWeight: 'bold' }}>
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paymentRecords.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{record.paymentId}</TableCell>
                          <TableCell align="center">{record.dueDate}</TableCell>
                          <TableCell align="center">₱ {record.amount}</TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              color: record.status === 'Open' ? 'green' : record.status === 'Pending' ? 'orange' : 'red',
                            }}
                          >
                            {record.status}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenPaymentDialog(false)} variant="outlined" color="error">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>




        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }} TransitionComponent={SlideTransitionDown}>
          <Alert onClose={handleClose} severity={alertSeverity as 'success' | 'warning' | 'error'} sx={{ width: 500 }} >
            <AlertTitle style={{ textAlign: 'left', fontWeight: 'bold' }}>{alerttitle}</AlertTitle>
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
          style={{ width: 450 }}
          theme="colored"
        />

      </OverallGrid>
    </div>
  );
}
