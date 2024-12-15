import React, { useState, useEffect } from "react";
import { ButtonProps } from "@mui/material";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Pagination,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

// Styled Button Component
const StyledButton: React.FC<ButtonProps> = (props: ButtonProps) => (
  <Button
    sx={{
      backgroundColor: "#2D85E7",
      color: "#fff",
      borderRadius: "20px",
      fontSize: "14px",
      padding: "5px 10px",
      "&:hover": {
        backgroundColor: "#1B5D99",
      },
    }}
    {...props} // Spread props to the underlying Button
  />
);

export default function DealerDashboard() {
  // State for orders, customers, and customer orders
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Pagination states
  const [ordersPage, setOrdersPage] = useState(1);
  const [customersPage, setCustomersPage] = useState(1);
  const [customerOrdersPage, setCustomerOrdersPage] = useState(1);

  const pageSize = 5; // Items per page
  const userFromStorage = JSON.parse(localStorage.getItem("user")!);

  // Fetch confirmed orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `https://distromentor.onrender.com/order/getAllConfirmedOrdersByDealerId/${userFromStorage.userId}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch dealer customers
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        `https://distromentor.onrender.com/customer/dealer/${userFromStorage.userId}`
      );
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Fetch customer orders
  const fetchCustomerOrders = async () => {
    try {
      const response = await axios.get(
        `https://distromentor.onrender.com/customerOrder/getAllCustomerOrdersByDealerId/${userFromStorage.userId}`
      );
      setCustomerOrders(response.data);
    } catch (error) {
      console.error("Error fetching customer orders:", error);
    }
  };

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchCustomers(), fetchCustomerOrders()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading data...</Typography>
      </Box>
    );
  }

  // Paginated Data
  const paginatedOrders = orders.slice((ordersPage - 1) * pageSize, ordersPage * pageSize);
  const paginatedCustomers = customers.slice(
    (customersPage - 1) * pageSize,
    customersPage * pageSize
  );
  const paginatedCustomerOrders = customerOrders.slice(
    (customerOrdersPage - 1) * pageSize,
    customerOrdersPage * pageSize
  );

  return (
    <Grid container spacing={3} sx={{ padding: 3, marginLeft: "60px" }}>
      {/* Orders Section */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 2, height: "100%", maxWidth: "90%" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", fontSize: "18px" }}>
            Dealer Orders
          </Typography>
          <TableContainer sx={{ maxHeight: "240px" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((order: any) => (
                  <TableRow key={order.orderid}>
                    <TableCell>{order.orderid}</TableCell>
                    <TableCell>{moment(order.orderdate).format("YYYY-MM-DD")}</TableCell>
                    <TableCell>₱{order.orderamount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          color:
                            order.status === "Open"
                              ? "green"
                              : order.status === "Pending"
                              ? "orange"
                              : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StyledButton
                        sx={{ fontSize: "12px", padding: "5px 10px" }}
                        onClick={() => navigate(`/orderTransactionDetails/${order.orderid}`)}
                      >
                        View
                      </StyledButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={Math.ceil(orders.length / pageSize)}
            page={ordersPage}
            onChange={(e, value) => setOrdersPage(value)}
            sx={{ mt: 2 }}
            size="small"
          />
        </Paper>
      </Grid>

      {/* Customers Section */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 2, height: "100%", maxWidth: "90%" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", fontSize: "18px" }}>
            Dealer Customers
          </Typography>
          <TableContainer sx={{ maxHeight: "240px" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Contact Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCustomers.map((customer: any) => (
                  <TableRow key={customer.customerID}>
                    <TableCell>{customer.customerID}</TableCell>
                    <TableCell>
                      {`${customer.firstName} ${customer.lastName}`}
                    </TableCell>
                    <TableCell>{customer.customerAddress}</TableCell>
                    <TableCell>{customer.customerContactNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={Math.ceil(customers.length / pageSize)}
            page={customersPage}
            onChange={(e, value) => setCustomersPage(value)}
            sx={{ mt: 2 }}
            size="small"
          />
        </Paper>
      </Grid>


      {/* Customer Orders Section */}
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          height: "100vh", // Full viewport height to center vertically
        }}
      >
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Paper elevation={3} sx={{ padding: 2, maxWidth: "80%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", fontSize: "18px" }}>
              Customer Orders
            </Typography>
            <TableContainer sx={{ maxHeight: "300px" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCustomerOrders.map((order: any) => (
                    <TableRow key={order.orderid}>
                      <TableCell>{order.orderid}</TableCell>
                      <TableCell>
                        {order.customer
                          ? `${order.customer.firstName} ${order.customer.lastName}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>{moment(order.orderdate).format("YYYY-MM-DD")}</TableCell>
                      <TableCell>₱{order.orderamount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          style={{
                            color:
                              order.status === "Open"
                                ? "green"
                                : order.status === "Pending"
                                ? "orange"
                                : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StyledButton
                          sx={{ fontSize: "12px", padding: "5px 10px" }}
                          onClick={() => navigate(`/customerTransaction/${order.orderid}`)}
                        >
                          View
                        </StyledButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={Math.ceil(customerOrders.length / pageSize)}
              page={customerOrdersPage}
              onChange={(e, value) => setCustomerOrdersPage(value)}
              sx={{ mt: 2 }}
              size="small"
            />
          </Paper>
        </Grid>
      </Grid>
    </Grid>


  );
}
