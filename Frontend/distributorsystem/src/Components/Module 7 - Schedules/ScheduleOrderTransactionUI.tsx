import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Card, TextField, TableContainer, Table, TableHead, Paper, TableRow, TableCell, TableBody, IconButton, Grid, TextFieldProps } from '@mui/material';
import styled from "@emotion/styled";
import { useRestPaymentTransaction } from "../../RestCalls/PaymentTransactionUseRest";
import { useEffect, useRef, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { IOrder, IPaymentTransaction } from "../../RestCalls/Interfaces";
import { useRestOrder } from "../../RestCalls/OrderUseRest";
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "react-router-dom";
//Imports for Toastify
//Please Install npm i react-toastify or if doesn't work, install npm i react-toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


const Typography1 = styled(Typography)({
    color: "#203949",
    transform: 'translateY(-50%)',
    fontSize: 18,
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
});

const Label1 = styled(Typography)({
    color: "#707070",
    transform: 'translateY(-50%)',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '550',
});

const StyledButton = styled(Button)({
    position: "relative",
    padding: 5,
    minHeight: 0,
    minWidth: 100,
    borderRadius: "22px",
    backgroundColor: '#AFD3E2',
    fontSize: '14px',
    color: '#146C94',
    textTransform: "none",
    fontWeight: "bold",
    width: 'fit-content',
    fontFamily: "Inter', sans-serif",
    display: 'inline-block',
});

const StyledBottomButton = styled(Button)({
    position: 'relative',
    top: '30px', // Adjust this value as needed
    padding: 5,
    minHeight: 0,
    minWidth: 200,
    borderRadius: "22px",
    backgroundColor: '#AFD3E2',
    fontSize: '14px',
    color: '#146C94',
    textTransform: "none",
    fontWeight: "bold",
    width: 'fit-content',
    fontFamily: "Inter', sans-serif",
    marginLeft: "80px",
    marginTop: '50px',

});

const StyledTextField = styled(TextField)({
    borderRadius: "22px", input: {
        padding: "10px", color: "black"
    },
    width: '200px',

});

const StyledCard = styled(Card)({
    borderRadius: "20px",
    padding: 1,
    width: 700,
    height: 50,
    position: "relative",
    marginLeft: "350px",
    marginTop: "25px"
});

const StyledOrderTransactionCard = styled(Card)({
    borderRadius: "20px",
    padding: 1,
    width: 1000,
    height: 150,
    position: "relative",
    marginLeft: "200px",
    marginTop: "10px"
});

const StyledPaymentTransactionCard = styled(Card)({
    borderRadius: "20px",
    padding: 1,
    width: 1000,
    height: 300,
    position: "relative",
    marginLeft: "200px",
    marginTop: "10px"
});

const StyledTypography = styled(Typography)({
    fontSize: 15,
    color: "#146C94",
    fontWeight: "bold"
});

const StyledOrderTypography = styled(Typography)({
    fontSize: 12,
    color: "#146C94",
    fontWeight: "bold"
});

const StyledTableHead = styled(TableHead)({
    backgroundColor: '#AFD3E2'
});

const TableHeaderCell = styled(TableCell)({
    fontSize: 15,
    color: "#146C94",
    fontWeight: "bold"
});





export default function Schedules() {

    let { objectId } = useParams();

    const [createPaymentTransaction, getPaymentTransactionByID, updatePaymentTransaction, paymentTransaction] = useRestPaymentTransaction();
    const [newOrder, getOrderByID, getOrderByPaymentTransactionID, assignCollector, removeCollector, order, orderFromPaymentTransaction, isOrderFound, assignedStatus, removeStatus, updateOrder, closedOrder, applyPenalty] = useRestOrder();


    const [startDate, setStartDate] = useState<Dayjs | null>();
    const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>();
    const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>();
    const [startDateModified, setStartDateModified] = useState(false);
    const [endDateModified, setEndDateModified] = useState(false);
    const [paymentTransactionsObjects, setPaymentTransactionsObjects] = useState<IPaymentTransaction[]>([]);

    // const [paymentTransactions, setPaymentTransactions] = useState<IPaymentTransaction[]>();
    const [initialMinDate, setInitialMinDate] = useState<Dayjs | null>(null);




    const userFromStorage = JSON.parse(localStorage.getItem("user")!);



    const handleCreatePaymentTransaction = () => {

        if (!startDate) {
            toast.warning('Please select a starting date before creating payment schedules.');
            return;
        }
        const newPaymentTransactions: IPaymentTransaction[] = [];
        let currentEndDate = dayjs(startDate);


        for (let i = 1; i <= order!.paymentterms; i++) {
            const uuid = uuidv4();
            const paymenttransactionuuid = uuid.slice(0, 8);

            const newPaymentTransaction: IPaymentTransaction = {
                paymenttransactionid: paymenttransactionuuid,
                amountdue: parseFloat((order!.orderamount / order!.paymentterms).toFixed(2)),
                startingdate: currentEndDate.format('YYYY-MM-DD') || "",
                enddate: currentEndDate.add(15, 'day').format('YYYY-MM-DD') || "",
                installmentnumber: i,
                paid: false,
                orderid: order?.orderid!,
                paymentreceipts: [],
            };
            currentEndDate = currentEndDate.add(15, 'day');
            newPaymentTransactions.push(newPaymentTransaction);
        }

        // After the loop is complete, update the state once with a callback.
        setPaymentTransactionsObjects((paymentTransactionsObjects) => {
            const updatedPaymentTransactions = [
                ...paymentTransactionsObjects,
                ...newPaymentTransactions,
            ];

            // Call createPaymentTransaction with the updated array.
            createPaymentTransaction(updatedPaymentTransactions, order!.orderid);

            toast.success('Schedules have been created successfully', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })

            return updatedPaymentTransactions;
        });



    };


    const handleEndDateUpdate = (newValue: Dayjs | null): void => {
        setSelectedEndDate(newValue);
        setEndDateModified(true);
    };


    const handleSaveClick = (transaction: IPaymentTransaction) => {

        const startingDateFromDB = dayjs(transaction.startingdate);
        const endDateFromDB = dayjs(transaction.enddate);

        const updatedStartingDate = selectedStartDate || startingDateFromDB;
        const updatedEndDate = selectedEndDate || endDateFromDB;


        if (updatedEndDate?.toString() === 'Invalid Date') {
            alert('Please select an end date.');
            return;
        }

        setStartDateModified(false);
        setEndDateModified(false);

        try {
            updatePaymentTransaction(
                transaction.paymenttransactionid,
                {
                    paymenttransactionid: transaction.paymenttransactionid,
                    amountdue: transaction.amountdue,
                    startingdate: updatedStartingDate?.format('YYYY-MM-DD') || '',
                    enddate: updatedEndDate?.format('YYYY-MM-DD') || '',
                    installmentnumber: transaction.installmentnumber,
                    paid: transaction.paid,
                    orderid: transaction.orderid,
                    paymentreceipts: transaction.paymentreceipts
                }
            )

            /* toast.success('Installment ' + transaction.installmentnumber + " schedule has been updated.", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            }) */

        } catch (error) {
            toast.error('Unexpected error updating payment transaction.', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
        }


    };

    const [inputValue, setInputValue] = useState('');
    const [displayedValue, setDisplayedValue] = useState(objectId || '');

    const orderIDChanger = () => {

    }

    const handleFindOrder = () => {
        setDisplayedValue(inputValue);
    };


    useEffect(() => {

        if (userFromStorage && userFromStorage.tableName === 'Sales Associate') {
            getOrderByID(displayedValue!, userFromStorage.salesAssociate.distributor.distributorid);
        }
        else if (userFromStorage && userFromStorage.tableName === 'Sales Associate and Cashier') {
            getOrderByID(displayedValue!, userFromStorage.salesAssociateAndCashier.distributor.distributorid);
        }
        else {
            getOrderByID(displayedValue!, userFromStorage.distributor.distributorid);
        }
        setInitialMinDate(dayjs() as Dayjs);


        //displayedValue kay para sa pag search sa orderids nga di mag disco's, niya mo render dayun
        //order.paymenttransactions kay para ika create og payment transaction kay mo render/reflect dayun
    }, [displayedValue, order?.paymenttransactions]);



    return (
        <div>

            <Grid container spacing={4} sx={{ display: "flex", justifyContent: "center", marginTop: '50px' }}>
                <Grid item container sx={{ width: '1000px', borderRadius: '22px', }} justifyContent={"center"}  >
                    <Grid item xs={4} sx={{ marginTop: '15px' }}>
                        <Typography1 sx={{ color: "#203949", transform: 'translateY(-50%)', fontFamily: 'Inter, sans - serif', }}>Search Order Transaction ID</Typography1>
                    </Grid>
                    <Grid item sx={{ marginTop: '15px' }}>
                        <Paper sx={{ borderRadius: "22px", height: "fit-content", transform: 'translateY(-50%)', border: '1px solid #ccc', boxShadow: 'none' }}>
                            <TextField id="standard-basic" variant="standard" InputProps={{ disableUnderline: true, }} onChange={(e) => setInputValue(e.target.value)} sx={{ width: '300px', height: '50px', '& input': { textAlign: 'left', padding: '12px 12px' } }}

                            />
                            <IconButton type="button" aria-label="search" sx={{ backgroundColor: "#2d85e7", height: '50px', width: '50px', borderRadius: "0 41% 41% 0", '&:hover': { backgroundColor: "#2d85e7" } }} onClick={() => { orderIDChanger(); handleFindOrder(); }}>
                                <SearchIcon sx={{ color: "white" }} />
                            </IconButton>

                        </Paper>
                    </Grid>

                </Grid>
            </Grid>
            <div>
                {order ? (
                    <div>
                        <Grid item container spacing={4} sx={{ display: "flex", justifyContent: "center", marginTop: '5px' }}>
                            <Grid item>
                                <Paper sx={{ backgroundColor: '#ffffff', borderRadius: "22px", height: "300px", justifyContent: 'center', display: 'flex', alignItems: 'center', position: 'relative', width: '1200px' }}>
                                    <Typography sx={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', fontFamily: 'Inter, sans - serif', fontWeight: 'bold', fontSize: '25px', color: "#203949", paddingTop: '30px' }}>Order Transaction Details</Typography>
                                    <TableContainer sx={{ borderBottom: 'none', padding: 2, marginTop: 1, border: 'none' }}>
                                        <Table aria-label='simple table' style={{ borderCollapse: 'collapse' }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableHeaderCell align="center"><Label1>Order Transaction ID</Label1></TableHeaderCell>
                                                    <TableHeaderCell align="center"><Label1>Dealer Name</Label1></TableHeaderCell>
                                                    <TableHeaderCell align="center"><Label1>Distribution Date</Label1></TableHeaderCell>
                                                    <TableHeaderCell align="center"><Label1>Payment Terms</Label1></TableHeaderCell>
                                                    <TableHeaderCell align="center"><Label1>Total Ordered Amount</Label1></TableHeaderCell>
                                                    <TableHeaderCell align="center"><Label1>Penalty Rate</Label1></TableHeaderCell>
                                                    <TableHeaderCell align="center"><Label1>Status</Label1></TableHeaderCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align='center'><Typography1>{order?.orderid}</Typography1></TableCell>
                                                    <TableCell align='center'><Typography1>{order?.dealer!.firstname}  {order?.dealer!.lastname}</Typography1></TableCell>
                                                    <TableCell align='center'><Typography1>{order?.distributiondate}</Typography1></TableCell>
                                                    <TableCell align='center'><Typography1>{order?.paymentterms}</Typography1></TableCell>
                                                    <TableCell align='center'><Typography1>Php {order?.orderamount}</Typography1></TableCell>
                                                    <TableCell align='center'><Typography1>{order?.penaltyrate}%</Typography1></TableCell>
                                                    <TableCell align="center">
                                                        <Typography1>
                                                            <span style={{ color: order?.status === 'Closed' ? 'red' : 'green' }}>
                                                                {order?.status?.toUpperCase()}
                                                            </span>
                                                        </Typography1>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                        {order?.paymenttransactions?.length !== 0 && order?.collector !== null ? (
                            <div>
                                <Grid item container spacing={4} sx={{ display: "flex", justifyContent: "center", marginTop: '10px' }}>
                                    <Grid item>
                                        <Paper sx={{ backgroundColor: '#ffffff', borderRadius: "22px", width: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'none' }}>
                                            <TableContainer>
                                                <Table aria-label='simple table'>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableHeaderCell align="center" sx={{ paddingTop: 5 }}><Label1>Payment Transaction ID</Label1></TableHeaderCell>
                                                            <TableHeaderCell align="center" sx={{ paddingTop: 5 }}><Label1>Installment Number</Label1></TableHeaderCell>
                                                            <TableHeaderCell align="center" sx={{ paddingTop: 5 }}><Label1>Starting Date</Label1></TableHeaderCell>
                                                            <TableHeaderCell align="center" sx={{ paddingTop: 5 }}><Label1>Ending Date</Label1></TableHeaderCell>
                                                            <TableHeaderCell align="center" sx={{ paddingTop: 5 }}><Label1>Amount Due</Label1></TableHeaderCell>
                                                            <TableHeaderCell align="center" sx={{ paddingTop: 5 }}></TableHeaderCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {order?.paymenttransactions!.sort((a, b) => {
                                                            return a.installmentnumber - (b.installmentnumber);
                                                        }).map((transaction) => (
                                                            <TableRow key={transaction.paymenttransactionid}>
                                                                <TableCell align="center">
                                                                    {transaction.paymenttransactionid}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    Installment {transaction.installmentnumber}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                        <Typography>{dayjs(transaction.startingdate).format('MM/DD/YYYY')}</Typography>
                                                                    </LocalizationProvider>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                        <DatePicker
                                                                            slotProps={{
                                                                                textField: {
                                                                                    InputProps: {
                                                                                        disableUnderline: true
                                                                                    },
                                                                                    variant: "standard",
                                                                                    style: { width: '50%', padding: '0 10px 0 10px' }
                                                                                }
                                                                            }}
                                                                            value={dayjs(transaction.enddate)}
                                                                            minDate={dayjs(transaction.enddate)}
                                                                            onChange={(newValue) => handleEndDateUpdate(newValue)}
                                                                            disabled={transaction.paid}
                                                                        />
                                                                    </LocalizationProvider>
                                                                </TableCell>
                                                                <TableCell>
                                                                    Php {transaction.amountdue.toFixed(2)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <StyledButton
                                                                        onClick={() => handleSaveClick(transaction)}
                                                                        disabled={transaction.paid}
                                                                    > Update </StyledButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Paper>
                                        <Grid></Grid>
                                    </Grid>
                                </Grid>

                                {order.status === 'Closed' ? (
                                    <div>
                                        <h1>All payment transactions have been paid. Order is closed.</h1>
                                    </div>
                                ) : (
                                    <div>
                                        {/* Additional content for non-closed orders can be added here */}
                                    </div>
                                )}
                            </div>


                        ) : order!.collector === null ? (
                            <div>
                                <h2 style={{ color: 'black', marginTop: '50px' }}> No Collector Assigned</h2>
                            </div>
                        ) : order?.paymenttransactions?.length === 0 ? (
                            <div>
                                <h2 style={{ color: 'black', marginTop: '50px' }}> No Schedules Yet</h2>
                                <Grid item container spacing={2} sx={{ display: "flex", justifyContent: "center", marginTop: '10px' }}>
                                    <Grid item>
                                        <Paper sx={{ backgroundColor: '#ffffff', borderRadius: "22px", width: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'none', height: '50px' }}>
                                            <Grid item container spacing={2} sx={{ display: "flex", justifyContent: "center", marginTop: '10px' }}>
                                                <Grid>
                                                    <Label1 sx={{ paddingTop: '30px', paddingLeft: '25px' }}>Select Starting Date </Label1>
                                                </Grid>
                                                <Grid>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            slotProps={{
                                                                textField: {
                                                                    InputProps: {
                                                                        disableUnderline: true
                                                                    },
                                                                    variant: "standard",
                                                                    style: { width: '55%', padding: '0 10px 0 10px' }
                                                                }
                                                            }}
                                                            minDate={initialMinDate}
                                                            onChange={(e) => setStartDate(e)}
                                                        />
                                                    </LocalizationProvider>
                                                </Grid>
                                                <Grid></Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                                <br></br>
                                <StyledButton onClick={handleCreatePaymentTransaction}> Create Schedules </StyledButton>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div></div>
                )}
            </div>

            {/* Alerts */}
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
}