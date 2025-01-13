import { useEffect, useState } from "react";
import { ICustomerOrder, IOrder } from "../../RestCalls/Interfaces";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Tab,
  Tabs,
  styled,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import moment from "moment";

// Styled Components
const StyledCard = styled(Card)({
  padding: "10px 10px 10px 2px",
  margin: "50px 28% 0px 7.2%",
  width: "90%",
  height: "550px",
  background: "linear-gradient(50deg, rgba(255,255,255,0.4) 12%,rgba(255,255,255,0.1) 77%)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  boxShadow: "0 4px 7px 1px rgba(0,0,0,0.28)",
  alignItems: "center",
  borderRadius: "10px",
  justifyContent: "center",
  position: "fixed",
});

const StyledButton = styled(Button)({
  backgroundColor: "rgb(45, 133, 231,0.8)",
  borderRadius: 20,
  color: "#FFFFFF",
  fontFamily: "Inter, sans-serif",
  fontSize: "15px",
  width: "100px",
  height: 35,
  ":hover": {
    backgroundColor: "#2D85E7",
    transform: "scale(1.1)",
  },
  transition: "all 0.4s",
});

const TabStyle = styled(Tab)({
  width: 320,
  fontWeight: "550",
});

const DataGridStyle = styled(DataGrid)({
  textAlign: "center",
  fontSize: 15,
  color: "#203949",
  height: "420px",
  width: "100%",
  margin: "10px 10px 0px 0px",
  borderRadius: "5px",
  border: "0px solid #e0e0e0",
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "rgb(45, 133, 231, 0.2)",
    fontWeight: "bold",
  },
  "& .MuiDataGrid-row:nth-of-type(even)": {
    backgroundColor: "rgb(45, 133, 231, 0.1)",
  },
});

export default function CustomerCollection() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState("MyOrder");
  const [openOrders, setOpenOrders] = useState<ICustomerOrder[]>([]);
  const [closeOrders, setCloseOrders] = useState<ICustomerOrder[]>([]);
  const [customerOrders, setCustomerOrders] = useState<ICustomerOrder[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [value, setValue] = useState(0);

  const userFromStorage = JSON.parse(localStorage.getItem("user")!);

  const toggleTables = (value: string) => setTabValue(value);

 useEffect(() => {
     // Fetch confirmed orders by dealer ID
     const getOrderByDealerId = (dealerID: string) => {
       axios
         .get<IOrder[]>(`http://localhost:8080/order/getAllConfirmedOrdersByDealerId/${dealerID}`)
         .then((response) => {
           console.log("Fetched Confirmed Orders:", response.data); // Debug the data
           setOrders(response.data); // Save confirmed orders
         })
         .catch((error) => {
           console.error('Error retrieving confirmed orders:', error);
         });
     };

     // Fetch customer orders by dealer ID
     const fetchCustomerOrders = (dealerID: string) => {
       axios
         .get<ICustomerOrder[]>(`http://localhost:8080/customerOrder/getAllCustomerOrdersByDealerId/${dealerID}`)
         .then((response) => {
           console.log("Fetched Customer Orders:", response.data); // Debug the data
           setCustomerOrders(response.data); // Save customer orders
         })
         .catch((error) => {
           console.error('Error fetching customer orders:', error);
         });
     };

     // Fetch both confirmed orders and customer orders
     if (userFromStorage.userId) {
       getOrderByDealerId(userFromStorage.userId); // Fetch confirmed orders
       fetchCustomerOrders(userFromStorage.userId); // Fetch customer orders
       setIsLoading(false); // Set loading to false after the data has been fetched
     }

   }, [userFromStorage.userId]);


   const columnsMyOrder: GridColDef[] = [
     { field: "id", headerName: "Order ID", width: 150 },
     { field: "orderDate", headerName: "Order Date", width: 180 },
     { field: "distributionDate", headerName: "Distribution Date", width: 200 },
     { field: "orderAmount", headerName: "Order Amount", width: 170 },
     {
       field: "orderStatus",
       headerName: "Status",
       width: 170,
       renderCell: (params) => (
         <span
           style={{
             color:
               params.value === "Open"
                 ? "green"
                 : params.value === "Pending"
                 ? "orange"
                 : "red",
             fontWeight: "bold",
           }}
         >
           {params.value}
         </span>
       ),
     },
     {
       field: 'action',
       headerName: '',
       width: 350,
       renderCell: (params: GridRenderCellParams) => {
         return (
           <StyledButton
             onClick={() =>
               params.row.confirmed
                 ? handleViewButtonClick(params.row.orderId)
                 : handleViewButtonFalse(params.row.orderId)
             }
           >
             View
           </StyledButton>
         );
       },
     },
   ];

   // Map all orders to rows
   const rowsMyOrder = orders.map((order) => ({
     id: order.orderid,
     orderDate: moment(order.orderdate).format('YYYY-MM-DD'),
     distributionDate: moment(order.distributiondate).format('YYYY-MM-DD'),
     orderAmount: `Php ${order.orderamount}`,
     orderStatus: order.status,
     confirmed: order.confirmed, // Add confirmed property for checking
     orderId: order.orderid, // Include orderId for the button's onClick handler
   }));

   const columnsCustomerOrders: GridColDef[] = [
     { field: "id", headerName: "Order ID", width: 150 },
     { field: "orderDate", headerName: "Order Date", width: 180 },
     { field: "customerName", headerName: "Customer Name", width: 200 },
     { field: "orderAmount", headerName: "Order Amount", width: 170 },
     {
       field: "orderStatus",
       headerName: "Status",
       width: 170,
       renderCell: (params) => (
         <span
           style={{
             color:
               params.value === "Open"
                 ? "green"
                 : params.value === "Pending"
                 ? "orange"
                 : "red",
             fontWeight: "bold",
           }}
         >
           {params.value}
         </span>
       ),
     },
     {
       field: 'action',
       headerName: '',
       width: 350,
       renderCell: (params: GridRenderCellParams) => {
         return (
           <StyledButton
             onClick={() =>
               params.row.confirmed
                 ? handleViewButtonClick(params.row.orderId)
                 : handleViewButtonFalse(params.row.orderId)
             }
           >
             View
           </StyledButton>
         );
       },
     },
   ];

   // Map all customer orders to rows
   const rowsCustomerOrders = customerOrders.map((order) => ({
     id: order.orderid,
     orderDate: moment(order.orderdate).format("YYYY-MM-DD"),
     customerName: `${order.customer?.firstName ?? "Unknown"} ${order.customer?.lastName ?? ""}`,
     orderAmount: `Php ${order.orderamount?.toFixed(2) ?? "0.00"}`,
     orderStatus: order.status,
     orderId: order.orderid, // Include orderId for the button's onClick handler
   }));

   const handleViewButtonClick = (objectId: string) => {
           // Use the `navigate` function to navigate to the details page with the objectId as a parameter

           navigate(`/orderTransactionDetails/${objectId}`);
       };

   const handleViewButtonFalse = (objectId: string) => {

           navigate(`/customerTransaction/${objectId}`);
       }

   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
              setValue(newValue);
          };

  return (
    <div>
      <StyledCard>
        <Box sx={{ width: "100%", marginTop: 4, marginLeft: 0.5 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={(e, val) => toggleTables(val)} style={{ marginLeft: 40 }}>
              <TabStyle label="My Order" value="MyOrder" />
              <TabStyle label="Customer Order" value="CustomerOrder" />
            </Tabs>
          </Box>
          <Box sx={{ p: 2 }}>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  marginTop: "200px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : tabValue === "MyOrder" ? (
              <DataGridStyle
                rows={rowsMyOrder}
                columns={columnsMyOrder}
                getRowId={(row) => row.id}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[10]}
              />
            ) : (
              <DataGridStyle
                rows={rowsCustomerOrders}
                columns={columnsCustomerOrders}
                getRowId={(row) => row.id}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[10]}
              />
            )}
          </Box>
        </Box>
      </StyledCard>
    </div>
  );
}
