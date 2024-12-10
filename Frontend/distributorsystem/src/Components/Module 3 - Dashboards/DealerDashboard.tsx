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
    <Grid container spacing={3} sx={{ padding: 3, marginLeft: "220px" }}>
      {/* Orders Section */}
      <Grid item xs={12} md={5}>
        <Paper elevation={3} sx={{ padding: 2, height: "100%" }}>
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
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order: any) => (
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
                  ))
                ) : (
                  // Placeholder rows to maintain consistent height
                  Array.from({ length: pageSize }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={5} align="center" sx={{ color: "#999" }}>
                        {index === 0 ? "No orders to display" : ""}
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
      <Grid item xs={12} md={5}>
        <Paper elevation={3} sx={{ padding: 2, height: "100%" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", fontSize: "18px" }}>
            Dealer Customers
          </Typography>
          <TableContainer sx={{ maxHeight: "240px" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer: any) => (
                    <TableRow key={customer.customerID}>
                      <TableCell>{customer.customerID}</TableCell>
                      <TableCell>{customer.firstName}</TableCell>
                      <TableCell>{customer.lastName}</TableCell>
                      <TableCell>
                        <StyledButton
                          sx={{ fontSize: "12px", padding: "5px 10px" }}
                          onClick={() => navigate(`/update_customer/${customer.customerID}`)}
                        >
                          Edit
                        </StyledButton>
                        <StyledButton
                          sx={{
                            ml: 1,
                            backgroundColor: "red",
                            fontSize: "12px",
                            padding: "5px 10px",
                          }}
                          onClick={() => console.log("Delete customer")}
                        >
                          Delete
                        </StyledButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Placeholder rows to maintain consistent height
                  Array.from({ length: pageSize }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={4} align="center" sx={{ color: "#999" }}>
                        {index === 0 ? "No customers to display" : ""}
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
    </Grid>
  );
}