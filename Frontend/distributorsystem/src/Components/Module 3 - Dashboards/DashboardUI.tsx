import { Grid, Paper, Autocomplete, Typography, styled, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Box, LinearProgress } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IDealer, IDistributor, IOrder, IDeposit } from "../../RestCalls/Interfaces";
import { useNavigate } from "react-router-dom";
import logo5 from '../../Global Components/Images/logo5.png';
import moment from 'moment';


const ProductName = styled(Typography)({
    position: 'relative',
    left: 30,
    top: -50
})

const QuantityName = styled(Typography)({
    position: 'relative',
    left: -20,
    top: -50
})

const PendingOrdersGrid = styled(Grid)({
    display: "flex",
    justifyContent: "center",
    marginTop: '10px'
})

const PendingOrdersPaper = styled(Paper)({
    top: 80,
    left: -280,
    backgroundColor: '#ffffff',
    borderRadius: "22px",
    height: "400px",
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '700px'
})

const PendingOrderTypo = styled(Typography)({
    position: 'absolute',
    top: '8%',
    left: '18%',
    transform: 'translateX(-50%)',
    fontFamily: 'Inter, sans - serif',
    fontWeight: 'bold',
    fontSize: '25px',
    color: "#203949"
})

const ViewOrdersTypo = styled(Typography)({
    position: 'absolute',
    top: '85%',
    cursor:'pointer',
    fontFamily: 'Inter, sans - serif',
    fontWeight: 'bold',
    fontSize: '15px',
    color: "#203949",
    textDecoration: 'underline black 2px',
    ':hover': {
        color: '#2D85E7',
        transform: 'scale(1.1)'
    },
    transition: 'all 0.4s',
})

const TableHeaderCell = styled(TableCell)({
    top: -10,
    position: 'relative',
    fontSize: 13,
    color: "#000000",
    fontWeight: "bold"
})

const PendingPaymentsPaper = styled(Paper)({
    top: 100,
    left: -280,
    backgroundColor: '#ffffff',
    borderRadius: "22px",
    height: "400px",
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '700px'
})

const PendingPaymentTypo = styled(Typography)({
    position: 'absolute',
    top: '8%',
    botton:8,
    left: '20%',
    transform: 'translateX(-50%)',
    fontFamily: 'Inter, sans - serif',
    fontWeight: 'bold',
    fontSize: '25px',
    color: "#203949"
})

const ViewPaymentTypo = styled(Typography)({
    position: 'absolute',
    top: '85%',
    cursor:'pointer',
    left: '30%',
    fontFamily: 'Inter, sans - serif',
    fontWeight: 'bold',
    fontSize: '15px',
    color: "#203949",
    textDecoration: 'underline black 2px',
    ':hover': {
        color: '#2D85E7',
        transform: 'scale(1.1)'
    },
    transition: 'all 0.4s',
})

const PendingPaymentsGrid = styled(Grid)({
    display: "flex",
    justifyContent: "center",
    marginTop: '10px'
})

const PendingDealerPaper = styled(Paper)({
    top: -735,
    left: 420,
    backgroundColor: '#ffffff',
    borderRadius: "22px",
    height: "800px",
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '580px'
})

const PendingDealerTypo = styled(Typography)({
    position: 'absolute',
    top: '4%',
    left: '35%',
    transform: 'translateX(-50%)',
    fontFamily: 'Inter, sans - serif',
    fontWeight: 'bold',
    fontSize: '25px',
    color: "#203949",

})

const ViewDealersTypo = styled(Typography)({
    position: 'absolute',
    top: '90%',
    cursor:'pointer',
    left: '30%',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: '15px',
    color: "#203949",
    textDecoration: 'underline #203949 2px',
    ':hover': {
        color: '#2D85E7',
        transform: 'scale(1.1)'
    },
    transition: 'all 0.4s',
})



const PendingDealerGrid = styled(Grid)({
    display: "flex",
    justifyContent: "center",
    marginTop: '10px'
})


export default function Dashboard() {

    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;
    const [unconfirmedDealers, setUnconfirmedDealers] = useState<IDealer[]>();
    const [unconfirmedOrders, setUnconfirmedOrders] = useState<IOrder[]>();
    const [unconfirmedDeposits, setUnconfirmedDeposits] = useState<IDeposit[]>([]);
    const [dealers, setDealers] = useState<Record<string, IDealer>>({});
    const paginatedOrders = unconfirmedOrders?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const emptyRows = rowsPerPage - (paginatedOrders?.length || 0);
    const handleRowClick = (orderId: string) => {
            navigate(`/orderConfirmation/${orderId}`);
        };
    const handleDealerClick = (dealerId: string) => {
        navigate(`/dealerProfileDetails/${dealerId}`); // Navigate to dealer profile page
      };
    const handleDepositClick = (depositId: string) => {
        navigate(`/depositDetails/${depositId}`);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
            setPage(newPage);
        };
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);


    const userFromStorage = JSON.parse(localStorage.getItem("user")!);
    //userFromStorage.distributor.

    const getAllUnconfirmedDealers = () => {
        axios.get(`http://distromentor.onrender.com/dealer/getAllUnconfirmedDealersByDistributorID/${userFromStorage.distributor.distributorid}`)
            .then((response) => {
                setUnconfirmedDealers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data: ', error);
            });
    }

    const getAllUnconfirmedOrders = () => {
        axios.get(`http://distromentor.onrender.com/order/getAllUnconfirmedOrdersByDistributorID/${userFromStorage.distributor.distributorid}`)
            .then((response) => {
                setUnconfirmedOrders(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data: ', error);
            });
    }

    const getAllUnconfirmedDeposits = () => {
        axios
          .get<IDeposit[]>(`http://distromentor.onrender.com/api/deposits/unconfirmed/distributor/${userFromStorage.distributor.distributorid}`)
          .then((response) => {
            setUnconfirmedDeposits(response.data);
          })
          .catch((error) => {
            console.error('Error fetching unconfirmed deposits:', error);
          });
    };

    const handleDealersListClick = () => {
        navigate(`/dealerProfileList`);
    }

    const handlePaymentsListClick = () => {
        navigate(`/depositReceipt`);
    }

    const handleOrdersListClick = () => {
        navigate(`/productDistributionList`);
    }

    const fetchDealerById = async (dealerid: string) => {
        try {
          const response = await axios.get<IDealer>(`http://distromentor.onrender.com/dealer/getDealerByID/${dealerid}`);
          setDealers((prevDealers) => ({ ...prevDealers, [dealerid]: response.data }));
        } catch (error) {
          console.error(`Error fetching dealer ${dealerid}:`, error);
        }
      };

    useEffect(() => {
      // Fetch dealer data for each deposit
      unconfirmedDeposits.forEach((deposit) => {
        if (!dealers[deposit.dealerid]) {
          fetchDealerById(deposit.dealerid);
        }
      });
    }, [unconfirmedDeposits]);

    useEffect(() => {
        getAllUnconfirmedDealers();
        getAllUnconfirmedOrders();
        getAllUnconfirmedDeposits();
    }, []);


    return (
        <Grid container>

             {unconfirmedOrders || unconfirmedDeposits || unconfirmedDealers ? (
            <><PendingOrdersGrid item container>
                        <PendingOrdersPaper>
                            <PendingOrderTypo>Pending Orders</PendingOrderTypo>
                            <TableContainer>
                                <Table style={{ position: 'absolute', top: 90, left: 0, right: 0 }} aria-label='simple table'>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeaderCell align='center'>Order Transaction ID</TableHeaderCell>
                                            <TableHeaderCell align='center'>Order Date</TableHeaderCell>
                                            <TableHeaderCell align='center'>Total Amount</TableHeaderCell>
                                            <TableHeaderCell align='center'>Dealer Name</TableHeaderCell>
                                        </TableRow>
                                    </TableHead>
                                     <TableBody>
                                        {unconfirmedOrders?.slice(0, 5).map((order) => (
                                            <TableRow
                                                key={order.orderid}
                                                onClick={() => handleRowClick(order.orderid)}
                                                onMouseEnter={() => setHoveredRow(order.orderid)} // Set hovered row ID
                                                onMouseLeave={() => setHoveredRow(null)} // Reset hovered row ID
                                                style={{
                                                    cursor: 'pointer',
                                                    transition: 'color 0.3s ease', // Smooth transition for text color change
                                                }}
                                            >
                                                <TableCell
                                                    align="center"
                                                    style={{
                                                        color: hoveredRow === order.orderid ? 'blue' : 'inherit', // Change text color on hover
                                                    }}
                                                >
                                                    {order.orderid}
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    style={{
                                                        color: hoveredRow === order.orderid ? 'blue' : 'inherit', // Change text color on hover
                                                    }}
                                                >
                                                    {order.orderdate}
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    style={{
                                                        color: hoveredRow === order.orderid ? 'blue' : 'inherit', // Change text color on hover
                                                    }}
                                                >
                                                    ₱{order.orderamount}
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    style={{
                                                        color: hoveredRow === order.orderid ? 'blue' : 'inherit', // Change text color on hover
                                                    }}
                                                >
                                                    {order.dealer.firstname + " " + order.dealer.lastname}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <ViewOrdersTypo onClick={() => handleOrdersListClick()}> View all orders </ViewOrdersTypo>

                        </PendingOrdersPaper>
                    </PendingOrdersGrid>
                    <PendingPaymentsGrid item container>
                            <PendingPaymentsPaper>
                                <PendingPaymentTypo>Pending Deposits</PendingPaymentTypo>
                                <TableContainer>
                                    <Table aria-label='simple table'>
                                        <TableHead>
                                            <TableRow>
                                                <TableHeaderCell align="center">Transaction ID</TableHeaderCell>
                                                <TableHeaderCell align="center">Submission Date</TableHeaderCell>
                                                <TableHeaderCell align="center">Amount</TableHeaderCell>
                                                <TableHeaderCell align="center">Dealer Name</TableHeaderCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {unconfirmedDeposits?.slice(0, 3).map((deposit) => (
                                            <TableRow
                                              key={deposit.depositid}
                                              style={{ cursor: 'pointer', transition: 'color 0.3s ease' }}
                                              onMouseEnter={() => setHoveredRow(deposit.depositid)}
                                              onMouseLeave={() => setHoveredRow(null)}
                                              onClick={() => handleDepositClick(deposit.depositid)}
                                            >
                                              <TableCell
                                                align="center"
                                                style={{
                                                  color: hoveredRow === deposit.depositid ? 'blue' : 'inherit',
                                                }}
                                              >
                                                {deposit.transactionnumber}
                                              </TableCell>
                                              <TableCell
                                                align="center"
                                                style={{
                                                  color: hoveredRow === deposit.depositid ? 'blue' : 'inherit',
                                                }}
                                              >
                                                {moment(deposit.submissionDate).format('YYYY-MM-DD')}
                                              </TableCell>
                                              <TableCell
                                                align="center"
                                                style={{
                                                  color: hoveredRow === deposit.depositid ? 'blue' : 'inherit',
                                                }}
                                              >
                                                ₱{deposit.amount}
                                              </TableCell>
                                              <TableCell
                                                align="center"
                                                style={{
                                                  color: hoveredRow === deposit.depositid ? 'blue' : 'inherit',
                                                }}
                                              >
                                                {dealers[deposit.dealerid]
                                                  ? `${dealers[deposit.dealerid].firstname} ${dealers[deposit.dealerid].lastname}`
                                                  : ''}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <ViewPaymentTypo onClick={() => handlePaymentsListClick()}> View all unconfirmed payments </ViewPaymentTypo>
                            </PendingPaymentsPaper>
                        </PendingPaymentsGrid><PendingDealerGrid item container>
                            <PendingDealerPaper>
                                <PendingDealerTypo>Pending Dealer Registration</PendingDealerTypo>
                                <TableContainer >
                                    <Table style={{ position: 'absolute', top: 90, left: 0, right: 0 }} aria-label='simple table'>
                                        <TableHead>
                                            <TableRow>
                                                <TableHeaderCell align='left'>Dealer Name</TableHeaderCell>
                                                <TableHeaderCell align='left'>Submission Date</TableHeaderCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {unconfirmedDealers?.slice(0, 5).map((dealer) => (
                                            <TableRow
                                              key={dealer.dealerid}
                                              style={{ cursor: 'pointer', transition: 'color 0.3s ease' }}
                                              onMouseEnter={() => setHoveredRow(dealer.dealerid)}
                                              onMouseLeave={() => setHoveredRow(null)}
                                              onClick={() => handleDealerClick(dealer.dealerid)}
                                            >
                                              <TableCell
                                                align="left"
                                                style={{
                                                  color: hoveredRow === dealer.dealerid ? 'blue' : 'inherit',
                                                }}
                                              >
                                                {dealer.firstname + ' ' + dealer.lastname}
                                              </TableCell>
                                              <TableCell
                                                align="left"
                                                style={{
                                                  color: hoveredRow === dealer.dealerid ? 'blue' : 'inherit',
                                                }}
                                              >
                                                {dealer.submissiondate}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <ViewDealersTypo onClick={() => handleDealersListClick()}> View all unconfirmed dealers </ViewDealersTypo>
                            </PendingDealerPaper>


                        </PendingDealerGrid></>
              ) : (

                <Box sx={{position:'fixed', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: '0', marginLeft: '90vh' }}>
                    <img src={logo5} alt="Logo" style={{ width: '375px', marginBottom: '-40px', marginTop:-250, marginLeft:-50 }} />
                    <LinearProgress sx={{ width: '80%',marginLeft:-6 }} />
                    {/* You can adjust the width as needed */}
                </Box>
            )}

        </Grid>
    )
}