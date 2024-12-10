import styled from "@emotion/styled";
import { Autocomplete, Alert, AlertTitle, Button, FormControlLabel, FormHelperText, Grid, Icon, IconButton, InputAdornment, Radio, RadioGroup, Snackbar, Switch, TextField, TextFieldProps, Typography, Card, Stepper, StepLabel, Step, Box, Menu, MenuItem } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import UploadIcon from '@mui/icons-material/Upload';
import dealer1 from '../../Global Components/Images/dealer1-2.png'
import logo4 from '../../Global Components/Images/logo4.png'
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
//// import Autosuggest, { SuggestionSelectedEventData, SuggestionsFetchRequestedParams, } from 'react-autosuggest';
import { CheckCircle } from '@mui/icons-material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { error } from "console";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
{/**Grids Body*/ }

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
    backgroundColor: ' rgba(255, 255, 255, 0.8)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(50px)',
    border: '0px solid rgba(255, 255, 255, 0.3)'

})

const StyleGrid = styled(Grid)({
    position: "relative",
    display: "flex",
    justifyContent: "center",
})
const ImageStyle = styled(Typography)({
    display: 'flex',
    alignItems: 'center',
    marginRight: '-1px',
    marginTop: '-30px'
})
const ContentNameTypography = styled(Typography)({
    paddingTop: '15px',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '25px',
    margin: '-15px 0 10px -450px',
    paddingLeft: '10px',
    color: '#203949',

})
const ScrollStyle = styled('div')({
    maxHeight: '480px',
    width: '750px',
    overflowY: 'auto',
    scrollSnapType: 'y mandatory',
    overflowX: 'hidden',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
        width: '1', // For Chrome, Safari, and Opera
        behavior: 'smooth',
    },
    WebkitOverflowScrolling: 'touch', // Enable smooth scrolling on iOS devices
    '& > div': {
        flex: '0 0 auto',
        scrollSnapAlign: 'start', // Snap to the start of each child element
        minWidth: '100%', // Ensure each child takes up the full width

    },


})

const ContentNameTypography1 = styled(Typography)({
    marginTop: -15,
    marginBottom: 15,
    marginLeft: 20,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: '20px',
    // margin: '-80px 0 30px -450px',

    paddingLeft: '10px',
    color: '#203949',

})
const LabelTypography = styled(Typography)({
    marginTop: 5,
    marginBottom: 10,
    fontFamily: 'Inter',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: '20px',
    marginLeft: '200px',
    color: '#707070'
})
const TypographyLabel = styled(Typography)({
    marginTop: "22px",
    marginLeft: '10px',
    marginBottom: '10px',
    marginRight: '-175px',
    fontFamily: 'Inter',
    fontWeight: '550',
    textAlign: 'left',
    fontSize: 17,
    display: 'flex',
    color: '#707070',

})
const TypographyLabelB = styled(Typography)({

    marginLeft: "220px",
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 17,
    color: '#707070',
    display: 'flex',
    fontWeight: '550',
    fontFamily: 'inter',
})
const TypographyLabelC = styled(Typography)({
    textAlign: 'center',
    fontSize: 12,
    color: '#ffffff',
    display: 'flex',
    fontWeight: '550',
    fontFamily: 'inter',

})


const StyledTextField = styled(TextField)({
    // backgroundColor: "#ffffff",
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


const StyledDatePicker = styled(DatePicker)({
    width: '700px',
    marginTop: "10px",
    // marginBottom:'43px',
    input: {
        color: '#707070',
        fontFamily: 'Inter'
    },
});

const GridBody = styled(Grid)({
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'space-between'
})


const labelStyle: React.CSSProperties = {
    fontWeight: '550',
    color: '#707070',
    fontFamily: 'Inter',
};
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
})


const GridField = styled(Grid)({


})

const UpdateProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>({
    productid: '',
    name: '',
    unit: '',
    price: 0,
    quantity: 0,
  });
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [fieldWarning, setFieldWarning] = useState({
    name: '',
    unit: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`https://distromentor.onrender.com/product/getAllProducts/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleUpdate = async () => {
    if (!product.name || !product.unit || !product.price || !product.quantity) {
      setFieldWarning({
        name: !product.name ? 'Product Name is required' : '',
        unit: !product.unit ? 'Unit is required' : '',
        price: !product.price ? 'Price is required' : '',
        quantity: !product.quantity ? 'Quantity is required' : '',
      });
      return;
    }

    try {
      await axios.put(`https://distromentor.onrender.com/product/${productId}`, product);
      setUpdateSuccess(true);
      setTimeout(() => {
        navigate('/productlist');
      }, 2000);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct: Product) => ({
      ...prevProduct,
      [name]: value,
    }));
  };




    {/**Return Statement*/ }
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
                                    <ContentNameTypography>Update Product</ContentNameTypography>
                                    <div style={{ paddingTop: 30, paddingBottom: 50 }}>
                                        <Grid container spacing={3}>
                                            {/* Textfield For Product Name */}
                                            <Grid item xs={12}>
                                                <StyledTextField variant="outlined" label="Product Name" name="name" style={{ width: '700px' }} value={product.name} onChange={handleChange} />
                                                <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                                                {fieldWarning.name}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledTextField variant="outlined" label="Unit" name="unit" style={{ width: '700px' }} value={product.unit} onChange={handleChange} />
                                                <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                                                {fieldWarning.unit}
                                                </FormHelperText>
                                            </Grid>
                                            {/* Textfield For Price */}
                                            <Grid item xs={12}>
                                                <StyledTextField variant="outlined" label="Price" name="price" style={{ width: '700px' }} type="number" value={product.price} onChange={handleChange} />
                                                <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                                                {fieldWarning.price}
                                                </FormHelperText>
                                            </Grid>
                                            {/* Textfield For Quantity */}
                                            <Grid item xs={12}>
                                                <StyledTextField variant="outlined" label="Quantity" name="quantity" style={{ width: '700px' }} type="number" value={product.quantity} onChange={handleChange} />
                                                <FormHelperText style={{ marginLeft: 5, color: '#BD9F00' }}>
                                                {fieldWarning.quantity}
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
                             Product Updated Successfully!
                           </Alert>
                        </Snackbar>
                </StyleGrid>
            </div>
    );
}


export default UpdateProduct;