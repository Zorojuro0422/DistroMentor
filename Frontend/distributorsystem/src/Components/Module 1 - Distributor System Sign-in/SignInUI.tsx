import styled from "@emotion/styled"
import { Alert, AlertColor, Box, Button, Grid, IconButton, Link, Snackbar, TextField, TextFieldProps, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import signin from "../../Global Components/Images/Group 8 (1).png"
import logo5 from '../../Global Components/Images/logo5.png'
import { useNavigate } from "react-router-dom"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import axios from "axios"
import Dashboard from "../Module 3 - Dashboards/DashboardUI"
import React from "react"
import { useRestDealer } from "../../RestCalls/DealerUseRest";
import { useRestEmployee } from "../../RestCalls/EmployeeUseRest";
import { useRestDistributor } from "../../RestCalls/DistributorUseRest";
import { useRestSignIn } from "../../RestCalls/SignInUseRest";

const Logo = styled(Typography)({
    margin: '5% 10% 0 5%',
    display: 'flex',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 'bold',
    fontSize: '25px',
    color: '#203949',
    justifyContent: 'space-between',
    marginBottom: '-120px',
})

const HeaderTypo = styled(Typography)({
    position: "relative",
    top: 150,
    // left: 1443,
    width: "200px",
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    color: "#203949",
    fontSize: 45
})

const SubHeaderTypo = styled(Typography)({
    position: "relative",
    top: 150,
    // left: 1395,
    width: "300px",
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    color: "#707070",
    fontSize: 14
})

const EmailTextfield = styled(TextField)({
    position: "relative",
    top: 200,
    // left: 1380,
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    color: "#203949",
    width: "350px",
    fontSize: 20
})

const PasswordTextfield = styled(TextField)({
    position: "relative",
    top: 220,
    // left: 1031,
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    color: "#203949",
    width: "350px",
    fontSize: 20
})

const SignInGrid = styled(Grid)({
    position: "relative",
    display: "flex",
    justifyContent: "center",
    // left: -520,
})

const ImageStyles = styled(Typography)({
    position: "relative",
    display: "flex",
    alignItems: 'center',
    top: 50,


})

const SignInButton = styled(Button)({
    position: "relative",
    top: 250,
    // left: 680,
    width: "350px",
})

const SignUpTypo = styled(Typography)({
    position: "relative",
    top: 270,
    // left: 1300,
    width: "500px",
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    color: "#707070",
    fontSize: 14
})

const SignInFieldsGrid = styled(Grid)({
    position: "relative",
    display: "flex",
    justifyContent: "center",

})

export default function SignIn() {
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState(0);
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor | undefined>();
    const navigate = useNavigate();

   



    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

         if (!userid || !password) {
            setSnackbarMessage("Please enter both User ID and Password");
            setSeverity("warning");
            setOpen(true);
            return;
        }
        axios.post('http://localhost:8080/signin', {
            userId: userid,
            password: password
        })
            .then((response) => {
                        if (response.status === 200) {
                            const result = response.data;
                            const userString = JSON.stringify(result);

                            localStorage.setItem('user', userString);
                            sessionStorage.setItem('user', userString);

                            if (result.tableName === 'Dealer') {
                                navigate('/dealerOrderForm');
                                setSuccessMessage("Login successful as Dealer");
                            } else if (result.tableName === 'Distributor') {
                                navigate('/dashboard');
                                setSuccessMessage("Login successful as Distributor");
                            } else if (result.tableName === 'Cashier') {
                                navigate('/cashierDashboard');
                                setSuccessMessage("Login successful as Employee");
                            } else if (result.tableName === 'Sales Associate') {
                                navigate('/salesAssociateDashboard');
                                setSuccessMessage("Login successful as Employee");
                            } else if (result.tableName === 'Sales Associate and Cashier') {
                                navigate('/sales&cashierDashboard');
                                setSuccessMessage("Login successful as Employee");
                            } else {
                                console.error("Unknown table name:", result.tableName);
                                setSnackbarMessage("Invalid User ID or Password");
                                setSeverity("error");
                            }
                            setOpen(true);
                        } else {
                            setSnackbarMessage("Invalid User ID or Password");
                            setSeverity("error");
                            setOpen(true);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });


    }




    useEffect(() => {

    }, [code]);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const action = (
        <Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );

    return (

        <Box component="form" noValidate onSubmit={handleSubmit} >
            <Logo sx={{ cursor: 'pointer' }}>
                <img src={logo5} alt="Logo" style={{ height: '150px', width: '270px', marginTop: '-3.5%' }} /> {/** Updated logo5 */}
            </Logo>
            <SignInGrid item container spacing={1}>
                <Grid item>
                    <SignInFieldsGrid container spacing={8}>
                        <Grid item>
                            <ImageStyles>
                                <img src={signin} style={{ width: 'auto', height: '580px', marginRight: -100, marginBottom: -100 }}></img>
                            </ImageStyles>
                        </Grid>
                    </SignInFieldsGrid>
                </Grid>
                <Grid item>
                    <SignInFieldsGrid container spacing={8}>
                        <Grid item>
                            <HeaderTypo>Sign In</HeaderTypo>
                        </Grid>
                    </SignInFieldsGrid>

                    <SignInFieldsGrid container spacing={8}>
                        <Grid item>
                            <SubHeaderTypo>Distributor System</SubHeaderTypo>
                        </Grid>
                    </SignInFieldsGrid>

                    <SignInFieldsGrid container spacing={8}>
                        <Grid item>
                            <EmailTextfield required id="userid" variant="outlined" label="User ID" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUserid(event.target.value)} />
                        </Grid>
                    </SignInFieldsGrid>
                    <SignInFieldsGrid container spacing={8}>
                        <Grid item>
                            <PasswordTextfield required id="password" variant="outlined" label="Password" type="password" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)} />
                        </Grid>
                    </SignInFieldsGrid>
                    <SignInFieldsGrid container spacing={8}>
                        <Grid item>
                            <SignInButton type="submit" variant="contained">Sign In</SignInButton>
                        </Grid>
                    </SignInFieldsGrid>
                    <SignInFieldsGrid container spacing={8}>
                        <Grid item>
                            <SignUpTypo>Don't have an account? <a href="/SignUpScreen">Sign Up</a></SignUpTypo>
                        </Grid>
                    </SignInFieldsGrid>
                </Grid>
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    action={action}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        severity={successMessage ? "success" : severity} // Use "success" for success and "error" for invalid input
                        onClose={handleClose}
                    >
                        {successMessage || snackbarMessage}
                    </Alert>
                </Snackbar>
            </SignInGrid>
        </Box>
    )
}