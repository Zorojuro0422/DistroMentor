import { useEffect, useState } from "react";
import { IArchivedDealer, IDealer } from "../../RestCalls/Interfaces";
import axios from "axios";
import { Box, Button, Card, CircularProgress, Dialog, DialogContent, DialogTitle, Tab, Tabs, styled } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import React from "react";


const StyledDeleteButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'rgba(255, 0, 0, 0.8)', // Red color with opacity
    borderRadius: 20,
    color: '#FFFFFF', // White text color
    fontFamily: 'Inter, sans-serif',
    fontSize: '15px',
    width: '100px',
    height: 35,
    ':hover': {
        backgroundColor: 'red', // Blue hover color
        transform: 'scale(1.1)'
    },
    transition: 'all 0.4s'
}));

const StyledCard = styled(Card)({
    padding: '10px 10px 10px 2px',
    margin: "50px 28% 0px 7.2%",
    width: '90%',
    height: '550px',
    background: 'linear-gradient(50deg, rgba(255,255,255,0.4) 12%,rgba(255,255,255,0.1) 77% )',
    backgroundBlendMode: '',
    // backgroundColor:'rgb(245, 247, 249,0.4)',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    boxShadow: '0 4px 7px 1px rgba(0,0,0,0.28)',
    alignItems: 'center',
    borderRadius: '10px',
    justifyContent: 'center',
    position: 'fixed'
})

const StyledButton = styled(Button)({
    backgroundColor: 'rgb(45, 133, 231,0.8)',
    borderRadius: 20,
    color: '#FFFFFF',
    fontFamily: 'Inter, sans-serif',
    fontSize: '15px',
    width: '100px',
    height: 35,
    ':hover': {
        backgroundColor: '#2D85E7',
        transform: 'scale(1.1)'
    },
    transition: 'all 0.4s'
})

const TabStyle = styled(Tab)({
    width: 320,
    fontWeight: '550',
    label: {
        color: '#707070',
        fontWeight: 'bold',
        fontFamily: 'Inter',
    }
})

const DataGridStyle = styled(DataGrid)({
    textAlign: 'center',
    fontSize: 15,
    color: '#203949',
    height: '420px',
    width: '100%',
    margin: '10px 10px 0px 0px',
    borderRadius: '5px',
    border: '0px solid #e0e0e0',
    '& .MuiDataGrid-columnHeader': {
        backgroundColor: 'rgb(45, 133, 231, 0.2)',
        fontWeight: 'bold'
    },

    '& .MuiDataGrid-row:nth-child(even)': {
        backgroundColor: 'rgb(45, 133, 231, 0.1)',
    },
})


export default function DealerProfileListUI() {
    const navigate = useNavigate();
    const [dealers, setDealers] = useState<IDealer[] | null>(null);
    const [archivedDealer, setArchivedDealer] = useState<IArchivedDealer[] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleCancelDelete = () => {
        setIsDialogOpen(false);
    };
    const [dealerId, setDealerId] = useState<string | null>(null);


    const userFromStorage = JSON.parse(localStorage.getItem("user")!);
    //userFromStorage.distributor.

    const handleDeleteConfirm = () => {
            // Send DELETE request to the API
            axios.delete(`http://localhost:8080/dealer/deleteDealer/${dealerId}`)
                .then(response => {
                    // Handle successful deletion, e.g., show a message to the user
                    console.log('Dealer deleted successfully.');
                })
                .catch(error => {
                    // Handle errors, e.g., show an error message
                    console.error('Error deleting dealer:', error);
                })
                .finally(() => {
                    // Close the dialog regardless of the result
                    setIsDialogOpen(false);
                });
        };
    const handleDeleteConfirmed = () => {
                // Send DELETE request to the API
                axios.delete(`http://localhost:8080/archived/deleteArchivedDealerById/${dealerId}`)
                    .then(response => {
                        // Handle successful deletion, e.g., show a message to the user
                        console.log('Dealer deleted successfully.');
                    })
                    .catch(error => {
                        // Handle errors, e.g., show an error message
                        console.error('Error deleting dealer:', error);
                    })
                    .finally(() => {
                        // Close the dialog regardless of the result
                        setIsDialogOpen(false);
                    });
            };

    const handleDeleteClick = (dealerId: string) => {
        setDealerId(dealerId);
        setIsDialogOpen(true);
    };

    function getAllDealers() {
        axios.get<IDealer[]>(`http://localhost:8080/dealer/getAllDealersByDistributorID/${userFromStorage.distributor.distributorid}`)
            .then((response) => {
                setDealers(response.data);

            })
            .catch((error) => {

            });
        
    }

    function getAllArchivedDealers() {
        axios.get<IArchivedDealer[]>(`http://localhost:8080/archived/getAllArchivedDealersByDistributorID/${userFromStorage.distributor.distributorid}`)
            .then((response) => {
                setArchivedDealer(response.data);


            })
            .catch((error) => {

            });
        
    }
    const [tabValue, setTabValue] = React.useState('unconfirmed');




    const toggleTables = (tabValue: string) => {
        setTabValue(tabValue);
    };




    {/** Columns for DataGrid */ }
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Dealer ID', width: 210 },
        { field: 'dealerName', headerName: 'Dealer Name', width: 300 },
        { field: 'submissionDate', headerName: 'Date Submitted', width: 190 },
        {
            field: 'view',
            headerName: '',
            width: 150,
            renderCell: (params: { row: any; }) => {
                const dealer = params.row;
                return (
                    <StyledButton
                        onClick={() => {

                            handleViewButtonClick(dealer.id, !dealer.confirmed);
                        }}
                    >
                        View
                    </StyledButton>)
            }
        },

    ]
    {/** Rows for DataGrid */ }

    const rows = (dealers || []).filter((dealer) => !dealer.confirmed).map((dealerList) => ({

        id: dealerList.dealerid,
        dealerName: `${dealerList.firstname} ${dealerList.middlename} ${dealerList.lastname}`,
        submissionDate: dealerList.submissiondate,


    }));

    {/** Columns for Confirmed */ }
  const columnsConfirmed: GridColDef[] = [
          { field: 'id', headerName: 'Dealer ID', width: 280 },
          { field: 'dealerName', headerName: 'Dealer Name', width: 410 },
          { field: 'submissionDate', headerName: 'Date Submitted', width: 303 },
          {
              field: 'view', headerName: '', width: 150,
              renderCell: (params: { row: any; }) => {
                  const dealer = params.row;
                  return (
                      <StyledButton
                          onClick={() => {
                              handleViewButtonClick(dealer.id, !dealer.confirmed);
                          }}
                      >
                          View
                      </StyledButton>
                  );
              }
          },
          {
            field: 'customer', headerName: '', width: 150,
            renderCell: (params: { row: any; }) => {
                const dealer = params.row;
                return (
                    <StyledButton
                        onClick={() => {
                            handleCustomerButtonClick(dealer.id);
                        }}
                    >
                        Customer
                    </StyledButton>
                );
            }
        },
          {
              field: 'delete', headerName: '', width: 150,
              renderCell: (params: { row: any; }) => {
                  const dealer = params.row;
                  return (
                      <>
                          <StyledDeleteButton onClick={() => handleDeleteClick(dealer.id)}>
                              Delete
                          </StyledDeleteButton>
                          <Dialog open={isDialogOpen} onClose={handleCancelDelete}>
                              <DialogTitle>Delete Confirmation</DialogTitle>
                              <DialogContent>
                                  Are you sure you want to delete this dealer?
                              </DialogContent>
                              <Button onClick={handleDeleteConfirm} color="secondary">
                                  Yes
                              </Button>
                              <Button onClick={handleCancelDelete} color="primary">
                                  Cancel
                              </Button>
                          </Dialog>
                      </>
                  );
              }
          },
      ];


    {/** Rows for DataGrid */ }
    const rowsConfirmed = (dealers || []).filter((dealer) => dealer.confirmed).map((dealerList) => ({
        id: dealerList.dealerid,
        dealerName: `${dealerList.firstname} ${dealerList.middlename} ${dealerList.lastname}`,
        submissionDate: dealerList.submissiondate,
    }));


    {/** Columns for Declined */ }
    const columnsDeclined: GridColDef[] = [
        { field: 'id', headerName: 'Dealer ID', width: 150 },
        { field: 'dealerName', headerName: 'Dealer Name', width: 250 },
        { field: 'submissionDate', headerName: 'Date Submitted', width: 170 },
        { field: 'archiveDate', headerName: 'Date Declined', width: 170 },
        { field: 'remarks', headerName: 'Reason', width: 350 },
        {
            field: 'delete', headerName: '', width: 150,
                          renderCell: (params: { row: any; }) => {
                              const dealer = params.row;
                              return (
                                  <>
                                      <StyledDeleteButton onClick={() => handleDeleteClick(dealer.id)}>
                                          Delete
                                      </StyledDeleteButton>
                                      <Dialog open={isDialogOpen} onClose={handleCancelDelete}>
                                          <DialogTitle>Delete Confirmation</DialogTitle>
                                          <DialogContent>
                                              Are you sure you want to delete this dealer?
                                          </DialogContent>
                                          <Button onClick={handleDeleteConfirmed} color="secondary">
                                              Yes
                                          </Button>
                                          <Button onClick={handleCancelDelete} color="primary">
                                              Cancel
                                          </Button>
                                      </Dialog>
                                  </>
                              );
                          }
        }
    ];

    {/** Rows for DataGrid */ }
    const rowsDeclined = (archivedDealer || []).map((archivedDealerList) => ({
        id: archivedDealerList.dealerid,
        dealerName: `${archivedDealerList.firstname} ${archivedDealerList.middlename} ${archivedDealerList.lastname}`,
        submissionDate: archivedDealerList.submissiondate,
        archiveDate: archivedDealerList.datearchived,
        remarks: archivedDealerList.remarks,
    }));


    // const filterRows= showConfirmDealers ? rows.filter((dealer1)?.map(dealerList)=>())
    const handleViewButtonClick = (objectId: string, isUnconfirmed: boolean) => {
        navigate(`/dealerProfileDetails/${objectId}`);
    };

    const handleCustomerButtonClick = (objectId: string) => {
            // Use the `navigate` function to navigate to the details page with the objectId as a parameter
            navigate(`/customer/${objectId}`);
        };

    useEffect(() => {
        getAllDealers();
        getAllArchivedDealers();

    }, [dealers]);


    return (
        <div>
            <StyledCard>

                <Box sx={{ width: '100%', marginTop: 4, marginLeft: 0.5 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={(event, newValue) => toggleTables(newValue)} style={{ marginLeft: 40 }}>
                            <TabStyle label="Unconfirmed Dealers" value="unconfirmed" />
                            <TabStyle label="Confirmed Dealers" value="confirmed" />
                            <TabStyle label="Declined Dealers" value="declined" />
                        </Tabs>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        {tabValue === 'unconfirmed' && (
                            <>
                                {dealers === null ? (
                                    // Display whatever you want when dealers is empty
                                    // For example, you can show a message or another component
                                    <div style={{
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',
                                        marginTop: '200px'
                                    }}>
                                        <CircularProgress />
                                    </div>

                                ) : (
                                    // Display the DataGrid when dealers is not empty
                                    <DataGridStyle
                                        rows={rows}

                                        columns={columns.map((column) => ({
                                            ...column,
                                        }))}
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
                            </>


                        )}

                        {tabValue === 'confirmed' && (
                            <>
                                {dealers === null ? (
                                    // Display whatever you want when dealers is empty
                                    // For example, you can show a message or another component
                                    <div style={{
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',
                                        marginTop: '200px'
                                    }}>
                                        <CircularProgress />
                                    </div>

                                ) : (
                                    <DataGridStyle rows={rowsConfirmed} columns={columnsConfirmed.map((column) => ({
                                        ...column,

                                    }))}
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
                            </>
                        )}

                        {tabValue === 'declined' && (
                            <>
                                {archivedDealer === null ? (
                                    // Display whatever you want when dealers is empty
                                    // For example, you can show a message or another component
                                    <div style={{
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',
                                        marginTop: '200px'
                                    }}>
                                        <CircularProgress />
                                    </div>

                                ) : (
                                    <DataGridStyle rows={rowsDeclined} columns={columnsDeclined.map((column) => ({
                                        ...column,
                                    }))}
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
                            </>
                        )}
                    </Box>
                </Box>



            </StyledCard>
        </div>

    );
}