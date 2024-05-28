import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Grid, Snackbar, Alert } from '@mui/material';

const CreateProduct: React.FC = () => {
    const [product, setProduct] = useState({
        name: '',
        unit: '',
        price: 0,
        commissionrate: 0,
    });
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<'success' | 'error'>('success');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://distromentor-capstone.onrender.com/product/createProduct', product);
            setMessage(response.data);
            setSeverity('success');
        } catch (error: any) {
            setMessage(error.response ? error.response.data : 'An error occurred');
            setSeverity('error');
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h5">Create Product</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="name"
                        label="Product Name"
                        variant="outlined"
                        fullWidth
                        required
                        value={product.name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="unit"
                        label="Unit"
                        variant="outlined"
                        fullWidth
                        required
                        value={product.unit}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="price"
                        label="Price"
                        type="number"
                        variant="outlined"
                        fullWidth
                        required
                        value={product.price}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="commissionrate"
                        label="Commission Rate"
                        type="number"
                        variant="outlined"
                        fullWidth
                        required
                        value={product.commissionrate}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                        Create Product
                    </Button>
                </Grid>
            </Grid>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CreateProduct;
