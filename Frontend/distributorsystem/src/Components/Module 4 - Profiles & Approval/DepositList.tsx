import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

interface Deposit {
  depositid: string;
  transactionnumber: string;
  amount: number;
  proofOfRemittance: string;
  status: string;
  dealerid: string;
  distributorid: string;
  submissionDate: string;
}

export default function DepositList() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch deposits on component mount
    axios.get('http://localhost:8080/api/deposits/all')  // Update the endpoint according to your backend
      .then((response) => {
        setDeposits(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching deposits');
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Deposits List
      </Typography>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && deposits.length === 0 && <Typography>No deposits found.</Typography>}

      {deposits.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction Number</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submission Date</TableCell>
                <TableCell>Proof of Remittance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deposits.map((deposit) => (
                <TableRow key={deposit.depositid}>
                  <TableCell>{deposit.transactionnumber}</TableCell>
                  <TableCell>₱{deposit.amount}</TableCell>
                  <TableCell>{deposit.status}</TableCell>
                  <TableCell>{new Date(deposit.submissionDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {deposit.proofOfRemittance ? (
                      <img
                        src={`http://localhost:8080${deposit.proofOfRemittance}`}  // Adjust path based on application
                        alt="Proof of Remittance"
                        style={{ width: '300px', height: '300px', objectFit: 'cover' }}  // Adjust the size to 300x300
                      />
                    ) : (
                      'No Proof Uploaded'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
