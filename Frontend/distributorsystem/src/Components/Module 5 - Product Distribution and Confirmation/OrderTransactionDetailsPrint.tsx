import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from "@mui/material";
import { IOrder } from "../../RestCalls/Interfaces";

const ContentNameTypography = styled(Typography)({
    marginTop: 60,
    marginLeft: '9%',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: '25px',
    color: '#203949'
})

const StyldeInfoHeader = styled(Typography)({
    marginTop: '35px',
    marginLeft: '80px',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: '20px',
    color: '#203949'
})

const InfoGrid = styled(Grid)({
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 10%',
});

const InfoLabel = styled(Typography)({
    fontWeight: '550',
    color: '#707070',
    fontSize: '15px',
    fontFamily: 'Inter',
});

const InfoData = styled(Typography)({
    color: '#203949',
    fontSize: '15px',
    fontFamily: 'Inter',
    fontWeight: '400',
});

const TableHeaderCell = styled(TableCell)({
    fontSize: 15,
    color: "#707070",
    fontWeight: "bold",
    textAlign: 'center'
});

export default function OrderTransactionDetailsPrint({ order }: { order: IOrder }) {
    return (
        <div>
            <StyldeInfoHeader>Dealer Contact Information</StyldeInfoHeader>

            {/* Dealer Info Grid */}
            <InfoGrid container>
                <Grid item>
                    <InfoLabel>Dealer Name:</InfoLabel>
                    <InfoData>{order?.dealer.firstname} {order?.dealer.middlename} {order?.dealer.lastname}</InfoData>
                </Grid>
                <Grid item>
                    <InfoLabel>Dealer ID:</InfoLabel>
                    <InfoData>{order?.dealer.dealerid}</InfoData>
                </Grid>
                <Grid item>
                    <InfoLabel>Contact Number:</InfoLabel>
                    <InfoData>{order?.dealer.contactnumber}</InfoData>
                </Grid>
                <Grid item>
                    <InfoLabel>Email Address:</InfoLabel>
                    <InfoData>{order?.dealer.emailaddress}</InfoData>
                </Grid>
                <Grid item>
                    <InfoLabel>Current Address:</InfoLabel>
                    <InfoData>{order?.dealer.currentaddress}</InfoData>
                </Grid>
            </InfoGrid>

            <StyldeInfoHeader sx={{ marginTop: '24px' }}>Order Transaction Information</StyldeInfoHeader>

            {/* Order Info Grid */}
            <InfoGrid container>
                <Grid item>
                    <InfoLabel>Order Transaction ID:</InfoLabel>
                    <InfoData>{order?.orderid}</InfoData>
                </Grid>
                <Grid item>
                    <InfoLabel>Order Distribution Date:</InfoLabel>
                    <InfoData>{order?.orderdate}</InfoData>
                </Grid>
                <Grid item>
                    <InfoLabel>Total Ordered Amount:</InfoLabel>
                    <InfoData>₱ {order?.orderamount}</InfoData>
                </Grid>
            </InfoGrid>

            <StyldeInfoHeader>Order Breakdown</StyldeInfoHeader>

            <Grid container sx={{ display: "flex", justifyContent: "center", marginTop: '-50px' }}>
                <Grid item>
                    <Paper
                        sx={{
                            marginTop: 8,
                            backgroundColor: '#ffffff',
                            borderRadius: "22px",
                            justifyContent: 'center',
                            width: '840px',
                            maxHeight: '80vh',  // Limit the maximum height to fit on a single page
                            overflowY: 'auto',    // Allow scrolling if content exceeds the height
                            pageBreakInside: 'avoid'
                        }}
                    >
                        <TableContainer>
                            <Table aria-label='simple table'>
                                <TableHead>
                                    <TableRow>
                                        <TableHeaderCell align="center">Quantity</TableHeaderCell>
                                        <TableHeaderCell align="center">Unit</TableHeaderCell>
                                        <TableHeaderCell align="center">Product Name</TableHeaderCell>
                                        <TableHeaderCell align="center">Unit Price</TableHeaderCell>
                                        <TableHeaderCell align="center">Amount</TableHeaderCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.orderedproducts.map((op, index) => (
                                        <TableRow key={index}>
                                            <TableCell align='center'>{op.quantity}</TableCell>
                                            <TableCell align='center'>{op.product.unit}</TableCell>
                                            <TableCell align='center'>{op.product.name}</TableCell>
                                            <TableCell align='center'>₱ {op.product.price.toFixed(2)}</TableCell>
                                            <TableCell align='center'>₱ {(op.product.price * op.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Total Ordered Amount */}
                        <Grid container sx={{ justifyContent: 'flex-end', paddingRight: '20px', paddingTop: '20px' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#203949' }}>
                                Total Ordered Amount: ₱ {order?.orderamount?.toFixed(2)}
                            </Typography>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}
