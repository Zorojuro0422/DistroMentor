import { useEffect, useState } from "react";
import { IDeposit, IDealer, PaymentRecord } from "../../RestCalls/Interfaces";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";

interface IDealerTotalResponse {
  totalOrderAmount: number;
  totalSRP: number;
  profit: number;
}

interface IProductSubtotalResponse {
  totalProductSubtotal: number;
}

// Styled Components
const StyledCard = styled(Card)({
  padding: "20px",
  margin: "50px auto",
  width: "60%",
  background: "linear-gradient(50deg, rgba(255,255,255,0.4) 12%,rgba(255,255,255,0.1) 77%)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  boxShadow: "0 4px 7px 1px rgba(0,0,0,0.28)",
  alignItems: "center",
  borderRadius: "10px",
  justifyContent: "center",
});

const StyledButton = styled(Button)({
  marginTop: "20px",
  marginLeft: "10px",
  backgroundColor: "rgb(45, 133, 231,0.8)",
  borderRadius: 20,
  color: "#FFFFFF",
  fontFamily: "Inter, sans-serif",
  fontSize: "15px",
  width: "120px",
  height: 40,
  ":hover": {
    backgroundColor: "#2D85E7",
    transform: "scale(1.1)",
  },
  transition: "all 0.4s",
});

export default function DepositDetailsUI() {
  const { objectId } = useParams<{ objectId: string }>(); // Use objectId from URL parameters
  const navigate = useNavigate();
  const [deposit, setDeposit] = useState<IDeposit | null>(null);
  const [dealer, setDealer] = useState<IDealer | null>(null);
  const [dealerTotalSales, setDealerTotalSales] = useState<number | null>(null); // State for dealer total sales
  const [dealerTotalDebt, setDealerTotalDebt] = useState<number | null>(null);   // State for dealer total debt
  const [dealerTotalSRP, setDealerTotalSRP] = useState<number | null>(null);     // State for dealer SRP
  const [dealerProfit, setDealerProfit] = useState<number | null>(null);         // State for dealer profit
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState<string>("");

  // Fetch the deposit by ID
  const fetchDepositById = async (id: string) => {
    try {
      const response = await axios.get<IDeposit>(`https://distromentor.onrender.com/api/deposits/${id}`);
      setDeposit(response.data);
      fetchDealerById(response.data.dealerid); // Fetch the dealer details
    } catch (error) {
      console.error("Error fetching deposit:", error);
      setError("Failed to load deposit data.");
      setIsLoading(false);
    }
  };

  // Fetch the dealer details by dealer ID
  const fetchDealerById = async (dealerId: string) => {
    try {
      const dealerResponse = await axios.get<IDealer>(`https://distromentor.onrender.com/dealer/getDealerByID/${dealerId}`);
      setDealer(dealerResponse.data);

      // Fetch dealer total sales (Total Order Amount), total SRP, and profit
      const salesResponse = await axios.get<IDealerTotalResponse>(`https://distromentor.onrender.com/dealerTotals/getByDealerId/${dealerId}`);
      setDealerTotalSales(salesResponse.data.totalOrderAmount);  // Set total sales
      setDealerTotalSRP(salesResponse.data.totalSRP);            // Set total SRP
      setDealerProfit(salesResponse.data.profit);                // Set profit

      // Fetch dealer total debt (Total Ordered Products Subtotal)
      const debtResponse = await axios.get<IProductSubtotalResponse>(`https://distromentor.onrender.com/allProductSubtotals/getByDealerId/${dealerId}`);
      setDealerTotalDebt(debtResponse.data.totalProductSubtotal); // Set total debt

    } catch (error) {
      console.error("Error fetching dealer:", error);
      setError("Failed to load dealer data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update dealer total sales and debt after confirmation
  const updateDealerTotalSalesAndDebt = async () => {
    if (!dealer || !deposit) return;

    const updatedTotalDebt = dealerTotalDebt! - deposit.amount;

    try {
      // Update dealer totals in the backend
      await axios.put(`https://distromentor.onrender.com/dealerTotals/updateByDealerId/${dealer!.dealerid}`, {
        totalOrderAmount: 0,   // Updated total sales
        totalSRP: 0,              // Pass the existing SRP
        profit: dealerProfit,                  // Pass the existing profit
      });

      // Update dealer total debt in the backend (AllProductSubtotals table)
      await axios.put(`https://distromentor.onrender.com/allProductSubtotals/updateByDealerId/${dealer!.dealerid}`, {
          totalProductSubtotal: updatedTotalDebt, // Updated total debt (subtotal)
      });

      // Update local state with the new values
      setDealerTotalDebt(updatedTotalDebt);

      alert("Dealer totals updated successfully!");
    } catch (error: any) {
      console.error("Error updating dealer totals:", error.response?.data || error);
      throw new Error("Failed to update dealer totals.");
    }
  };

  // Handle confirm action
  const handleConfirm = async () => {
    if (!deposit || !deposit.orderid || !deposit.paymentid) {
      alert("Order ID or Payment ID is missing in the deposit data.");
      return;
    }

    try {
      // Confirm deposit in the backend
      await axios.patch(`https://distromentor.onrender.com/api/deposits/confirm/${objectId}`);

      // Fetch the latest order data
      const orderResponse = await axios.get(
        `https://distromentor.onrender.com/order/getOrderByID/${deposit.orderid}`
      );
      const order = orderResponse.data;

      if (!order) {
        alert("Order not found.");
        return;
      }

      // Update the deposit amount and determine the updated status
      const updatedDeposit = (order.deposit || 0) + deposit.amount; // Add deposit amount to the existing deposit
      const updatedStatus = updatedDeposit === order.orderamount ? "Closed" : "Pending"; // Determine the new status

      // Update the order object with the new deposit and status
      const updatedOrder = { ...order, deposit: updatedDeposit, status: updatedStatus };
      console.log("Updated Order Object:", updatedOrder);

      // Send the update request for the order
      await axios.put(
        `https://distromentor.onrender.com/order/updateOrder/${deposit.orderid}`,
        updatedOrder
      );

      // Update the specific payment record to "Paid"
      await axios.put(
        `https://distromentor.onrender.com/payment-records/${deposit.paymentid}`,
        {
          ...deposit, // Spread the existing deposit object
          status: "Paid", // Update only the status field
        }
      );

      console.log(`Payment Record ${deposit.paymentid} updated to Paid.`);

        const dealerId = order.dealer?.dealerid;

        if (!dealerId) {
          console.error("Dealer ID is missing!");
          return;
        }

        try {
          // Log the dealer ID
          console.log("Fetching totalProductSubtotal for dealerId:", dealerId);

          // Fetch the current totalProductSubtotal
          const response = await axios.get(
            `https://distromentor.onrender.com/allProductSubtotals/getByDealerId/${deposit.dealerid}`
          );

          // Log the fetched response
          console.log("Response from getByDealerId API:", response.data);

          const totalProductSubtotal = response.data.totalProductSubtotal;

          // Log the current totalProductSubtotal
          console.log("Current totalProductSubtotal:", totalProductSubtotal);

          const updatedTotalDebt = totalProductSubtotal - deposit.amount;

          // Log the updated totalProductSubtotal
          console.log("Updated totalProductSubtotal after deduction:", updatedTotalDebt);

          // Update the allProductSubtotals in the backend
          const updateResponse = await axios.put(
            `https://distromentor.onrender.com/allProductSubtotals/updateByDealerId/${deposit.dealerid}`,
            {
              totalProductSubtotal: updatedTotalDebt, // Updated total debt (subtotal)
            }
          );

          // Log the response from the update API
          console.log("Response from updateByDealerId API:", updateResponse.data);

          console.log("Updated totalProductSubtotal successfully:", updatedTotalDebt);
        } catch (error) {
          console.error("Error occurred while fetching or updating totalProductSubtotal:", error);
        }

      // Refetch the updated order data to ensure UI is in sync
      const updatedOrderResponse = await axios.get(
        `https://distromentor.onrender.com/order/getOrderByID/${deposit.orderid}`
      );
      console.log("Updated Order from Backend:", updatedOrderResponse.data);

      alert("Deposit confirmed, order and payment record updated successfully!");
      navigate(-1); // Navigate back after confirmation
    } catch (error) {
      console.error("Error confirming deposit or updating order:", error);

      if (axios.isAxiosError(error) && error.response) {
        alert(
          `Error: ${error.response.data.message || "Failed to confirm deposit or update order."}`
        );
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Handle decline action
  const handleDecline = async () => {
    try {
      await axios.patch(`https://distromentor.onrender.com/api/deposits/decline/${objectId}`, null, {
        params: { reason: declineReason },
      });
      alert("Deposit declined.");
      setIsDeclineDialogOpen(false);
      navigate(-1); // Navigate back after declining
    } catch (error) {
      console.error("Error declining deposit:", error);
      alert("Failed to decline deposit.");
    }
  };

  useEffect(() => {
    if (objectId) fetchDepositById(objectId); // Fetch deposit details by ID
  }, [objectId]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <StyledCard>
      <Typography variant="h4" gutterBottom>
        Deposit Details
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {deposit && (
        <>
          <Typography variant="h6">Transaction Number:</Typography>
          <Typography gutterBottom>{deposit.transactionnumber}</Typography>

          <Typography variant="h6">Amount:</Typography>
          <Typography gutterBottom>₱{deposit.amount.toFixed(2)}</Typography>

          <Typography variant="h6">Submission Date:</Typography>
          <Typography gutterBottom>{moment(deposit.submissionDate).format("YYYY-MM-DD")}</Typography>

          {dealer && (
            <>
              <Typography variant="h6">Dealer Name:</Typography>
              <Typography gutterBottom>
                {dealer.firstname} {dealer.lastname}
              </Typography>

              {/* Display Dealer Total Sales */}
              <Typography variant="h6">Dealer Total Sales:</Typography>
              <Typography gutterBottom>₱{dealerTotalSales?.toFixed(2) || "0.00"}</Typography>

              {/* Display Dealer Total Debt */}
              <Typography variant="h6">Dealer Total Debt:</Typography>
              <Typography gutterBottom>₱{dealerTotalDebt?.toFixed(2) || "0.00"}</Typography>
            </>
          )}

          <Typography variant="h6">Proof of Remittance:</Typography>
          <Typography gutterBottom>
            <a href={`https://distromentor.onrender.com${deposit.proofOfRemittance}`} target="_blank" rel="noopener noreferrer">
              View Proof
            </a>
          </Typography>

          {/* Confirm and Decline Buttons */}
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <StyledButton onClick={handleConfirm}>Confirm</StyledButton>
            <StyledButton
              onClick={() => setIsDeclineDialogOpen(true)}
              sx={{ backgroundColor: "red", ":hover": { backgroundColor: "#e53935" } }}
            >
              Decline
            </StyledButton>
          </Box>
        </>
      )}

      <StyledButton onClick={() => navigate(-1)}>Back</StyledButton>

      {/* Decline Reason Dialog */}
      <Dialog open={isDeclineDialogOpen} onClose={() => setIsDeclineDialogOpen(false)}>
        <DialogTitle>Decline Deposit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Decline"
            fullWidth
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeclineDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDecline} color="secondary">
            Decline
          </Button>
        </DialogActions>
      </Dialog>
    </StyledCard>
  );
}
