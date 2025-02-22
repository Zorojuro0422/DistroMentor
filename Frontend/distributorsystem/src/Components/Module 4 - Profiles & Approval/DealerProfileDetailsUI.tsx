import { useContext, useEffect, useRef, useState } from "react";
import { useRestDealer } from "../../RestCalls/DealerUseRest";
import { IDealer, IDealerDocument, IDealerPaymentProof, IOrder, ICustomerOrder } from "../../RestCalls/Interfaces";
import axios from "axios";
import { Button, Card, Grid, Icon, Modal, Paper, Stack, Typography, styled, Tab, Box, Tabs, Snackbar, Alert, AlertTitle, SlideProps, Slide, TextFieldProps, TextField, LinearProgress } from "@mui/material";
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import profilepic from "./profilepic.png"
import profilepicture from "../../Global Components/Images/profilepicture.png"
import { useNavigate, useParams } from "react-router-dom";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import logo5 from '../../Global Components/Images/logo5.png';
import moment from 'moment';
import { ToastContainer, toast } from "react-toastify";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function SlideTransitionDown(props: SlideProps) {
    return <Slide {...props} direction="down" />;
}

const ContentNameTypography = styled(Typography)({
    position: "absolute",
    marginTop: 100,
    marginLeft: 190,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: '25px',
    color: '#203949'
});

const StyldeInfoHeader = styled(Typography)({
    marginTop: '170px',
    marginBottom: '20px',
    marginLeft: '10%',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: '20px',
    color: '#203949'
});

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

const StackStyle = styled(Stack)({
    position: 'absolute',
    top: '230px',
    left: '-12%',
    fontFamily: 'Inter',
});

const StyleLabel = styled(Typography)({
    textAlign: 'left',
    fontWeight: '550',
    marginTop: 40,
    marginLeft: 10,
    color: '#707070',
    fontSize: '17px',
    width: 'max-content',
    fontFamily: 'Inter',
});

const StyleData = styled(Typography)({
    textAlign: 'left',
    width: 250,
    marginLeft: 30,
    marginTop: 15,
    color: '#203949',
    fontSize: '17px',
    fontFamily: 'Inter, sans - serif',
});

const StyleLabel2 = styled(Typography)({
    textAlign: 'left',
    fontWeight: '550',
    marginTop: 30,
    marginLeft: 210,
    color: '#707070',
    fontSize: '22px',
    width: 'max-content',
    fontFamily: 'Inter',
});

const StyleMainLabel = styled(Typography)({
    marginTop: 160,
    textAlign: 'left',
    fontWeight: '550',
    marginLeft: 90,
    marginRight: 50,
    color: '#707070',
    fontSize: '18px',
    fontFamily: 'Inter',
});

const StyleMainInfo = styled(Typography)({
    position: 'relative',
    fontWeight: '550',
    textAlign: 'left',
    marginLeft: 110,
    marginRight: 10,
    color: '#203949',
    fontSize: '18px',
    fontFamily: 'Inter',
});

const StyleCredit = styled(Paper)({
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    border: 'light',
    borderRadius: '20px',
    position: 'absolute',
    width: '150px',
    height: '25px',
    left: '-150px',
    top: '35px',
});

const ButtonInfo = styled(Button)({
    background: "#F5F7F9",
    color: "#203949",
    fontSize: 20,
    marginLeft: 100,
    marginTop: -170,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: 'bold',
    borderRadius: 10,
    width: '320px',
    height: '60px',
    ':hover': {
        backgroundColor: '#F5F7F9',
        transform: 'scale(1.1)'
    },
    transition: 'all 0.4s'
});

const IconStyle = styled(Icon)({
    color: '#2A9221',
    ':hover': {
        color: '#1E6717',
        transform: 'scale(1.1)'
    },
    transition: 'all 0.4s'
});

const IconStyle2 = styled(Icon)({
    marginLeft: 5,
    color: '#E77D7D',
    ':hover': {
        color: 'red',
        transform: 'scale(1.1)'
    },
    transition: 'all 0.4s'
});

const ButtonCredit = styled(Button)({
    background: "#F5F7F9",
    color: "#203949",
    fontSize: 15,
    fontWeight: 'bold',
    width: '20px',
    height: '35px',
    ':hover': {
        backgroundColor: '#F5F7F9',
        transform: 'scale(1.1)'
    },
    transition: 'all 0.4s'
});

const TabStyle = styled(Tab)({
    width: 240,
    fontWeight: '550',
    label: {
        color: '#707070',
        fontWeight: 'bold',
        fontFamily: 'Inter',
    }
});

const ButtonClose = styled(Button)({
    backgroundColor: '#E77D7D',
    width: 40,
    height: 40,
    ':hover': {
        backgroundColor: 'red',
        transform: 'scale(1.1)'
    },
    transition: 'all 0.4s'
});

const ButtonDocument = styled(Button)({
    background: "#D9D9D9",
    color: "#203949",
    fontSize: 10,
    marginLeft: 160,
    marginTop: 15,
    marginBottom: -5,
    paddingLeft: 3,
    paddingRight: 3,
    fontWeight: 'lighter',
    borderRadius: 5,
    width: 300,
    height: '40px',
    ':hover': {
        backgroundColor: '#F5F7F9',
        transform: 'scale(1.1)'
    },
    transition: 'all 0.4s'
});

const ProfileCard = styled(Card)({
    display: 'flex',
    borderRadius: 22,
    width: 300,
    height: 240,
    marginTop: 75,
    marginLeft: 160
});

const ModalCard = styled(Card)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 750,
    height: '90%',
    backgroundColor: 'background.paper',
    border: '2px',
    p: 4,
});

const DealerProfileDetails = () => {
    const [value, setValue] = useState(0);
    const [getDealerByID, getDealerByDistributor, newDealer, confirmDealer, markDealerAsPending, declineDealer, resetDealer, updateDealerCreditLimit, isDealerFound, isDealerConfirmed, dealer, dealerRemainingCredit, getDealerByIDForProfile] = useRestDealer();
    const [dealerDocuments, setDealerDocuments] = useState<IDealerDocument[]>([]);
    const [open, setOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<IDealerDocument | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditIcon, setIsEditIcon] = useState(true);
    const [openAlert, setOpenAlert] = useState(false);
    const [alerttitle, setTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [openDeclinedModal, setOpenDeclinedModal] = useState(false);
    const [dealerId, setDealerId] = useState<string | null>(null);
    const declineReasonRef = useRef<TextFieldProps>(null);
    const [creditLimitModalOpen, setCreditLimitModalOpen] = useState(false);
    const navigate = useNavigate();
    const { objectId } = useParams();
    const signedInDealer = JSON.parse(localStorage.getItem("user")!);
    const [selectedDealerId, setSelectedDealerId] = useState<string>("");
    const creditLimitRef = useRef<HTMLInputElement>(null);
    const [isUnconfirmedDealer, setIsUnconfirmedDealer] = useState(false);
    const [customerOrders, setCustomerOrders] = useState<ICustomerOrder[]>([]);
    {/*Tabs*/ }
    function CustomTabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    {/**Handler for Alert - Function to define the type of alert*/ }
    function headerHandleAlert(title: string, message: string, severity: 'success' | 'warning' | 'error') {
        setTitle(title);
        setAlertMessage(message);
        setAlertSeverity(severity);
        setOpenAlert(true);
    }

    {/**Handler to Close Alert Snackbar*/ }
    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log("Tab Index Changed: ", newValue); // Debug log
        setValue(newValue);
    };

    const handleOpenDocument = (document: IDealerDocument) => {
        if (document) {
            setSelectedDocument(document);
            setOpen(true);
        }
    };

    const handleCloseDocument = () => {
        setOpen(false);
        setOpenProfile(false);
    };

    const getOrderByDealerId = (dealerID: string) => {
        axios.get(`https://distromentor.onrender.com/order/getAllConfirmedOrdersByDealerId/${dealerID}`)
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                console.error('Error retrieving Order by Dealer Data!')
            });
    };
    const fetchCustomerOrders = (dealerID: string) => {
        axios.get<ICustomerOrder[]>(`https://distromentor.onrender.com/customerOrder/getAllCustomerOrdersByDealerId/${dealerID}`)
            .then((response) => {
                console.log("Fetched Customer Orders: ", response.data); // Debug fetched data
                setCustomerOrders(response.data);
            })
            .catch((error) => {
                console.error("Error fetching customer orders: ", error);
            });
    };

    function getAllDealerDocuments() {
        axios.get<IDealerDocument[]>(`https://distromentor.onrender.com/dealerdocument/findAllDocumentsByDealerId/${objectId!}`)
            .then((response) => {
                setDealerDocuments(response.data);
            })
            .catch((error) => {
                console.error("Error retrieving dealer documents. Please try again.");
            });
    };

    const handleFindDealer = () => {
        getDealerByIDForProfile(objectId!);
        getAllDealerDocuments();
        getOrderByDealerId(objectId!);
        fetchCustomerOrders(objectId!);
    };

    const business = dealer?.hasbusiness ? (
        <>
            <Grid container>
                <Grid item>
                    <StyleLabel>Business Name</StyleLabel>
                    <StyleData>{dealer?.businessname}</StyleData>
                </Grid>
                <Grid item>
                    <StyleLabel>Business Number</StyleLabel>
                    <StyleData>{dealer?.businessphone}</StyleData>
                </Grid>
                <Grid item>
                    <StyleLabel>Business Address</StyleLabel>
                    <StyleData>{dealer?.businessaddress}</StyleData>
                </Grid>
            </Grid>
            <Grid container style={{ marginTop: 25 }}>
                <Grid item>
                    <StyleLabel>TIN Number</StyleLabel>
                    <StyleData>{dealer?.businesstin}</StyleData>
                </Grid>
            </Grid>
        </>
    ) : (<Typography>Dealer Has No Business Information.</Typography>);

    useEffect(() => {
        if (objectId !== null) {
            handleFindDealer();
        }
    }, [objectId]);

    const displayFile = (base64Content: Uint8Array | null, fileType: string, docname: string, documentid: string, dealerparam: IDealer) => {
        if (base64Content) {
            if (fileType === 'application/pdf') {
                return (
                    <ButtonDocument variant={"contained"} onClick={() => handleOpenDocument({
                        content: base64Content,
                        type: fileType,
                        name: docname,
                        documentid: documentid,
                        dealer: dealerparam!
                    })} >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#203949" height={15} style={{ marginRight: 10, marginLeft: -15, marginTop: -2 }}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        {docname}
                    </ButtonDocument>
                );
            } else if (fileType.startsWith('image') && !docname.endsWith('_profilepicture')) {
                return (
                    <ButtonDocument variant={"contained"} onClick={() => handleOpenDocument({
                        content: base64Content,
                        type: fileType,
                        name: docname,
                        documentid: documentid,
                        dealer: dealerparam!
                    })}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#203949" height={15} style={{ marginRight: 10, marginLeft: -15, marginTop: -2 }} >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        {docname}
                    </ButtonDocument>
                );
            } else {
                if (!docname.endsWith('_profilepicture')) {
                    return (
                        <a href={`data:${fileType};base64,${base64Content}`} download={`document.${fileType}`}>
                            Download Document
                        </a>
                    );
                }
            }
        } else {
            return <div>No content available</div>;
        }
    };

    const handleEditCreditLimit = () => {
        setIsEditing(true);
        setIsEditIcon(!isEditIcon);
    };

    const handleUpdateCreditLimit = (objectId: string) => {
        const newCreditLimit = Number((creditLimitRef.current as unknown as HTMLInputElement)?.value);

        if (!isNaN(newCreditLimit)) {
            updateDealerCreditLimit(objectId, newCreditLimit);
            setIsEditing(false);
            setIsEditIcon(!isEditIcon);
        } else {
            console.error('Invalid credit limit input');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setIsEditIcon(true);
    };

    const handleViewButtonClick = (objectId: string) => {
        navigate(`/orderTransactionDetails/${objectId}`);
    };

    const handleViewButtonFalse = (objectId: string) => {
        navigate(`/orderConfirmation/${objectId}`);
    };

    const profilePic = dealerDocuments.find(image => image.name === dealer?.lastname + '_profilepicture');
    const imageSource = profilePic ? `data:${profilePic?.type} ;base64,${profilePic?.content}`
        : profilepicture;
    const handleOpenProfile = () => {
        setOpenProfile(true);
    };

    const handleConfirmButton = (objectId: string) => {
        confirmDealer(objectId, Number(creditLimitRef.current?.value));
        handleConfirmClose();
    };

    const handleDeclineClick = (objectId: string) => {
        const dateArchive = moment().format('YYYY-MM-DD');
        declineDealer(objectId, declineReasonRef.current!.value + "", dateArchive);
        handleDeclinedClose();
    };

    const handleConfirmOpen = () => setCreditLimitModalOpen(true);
    const handleDeclinedOpen = () => setOpenDeclinedModal(true);
    const handleConfirmClose = () => setCreditLimitModalOpen(false);
    const handleDeclinedClose = () => setOpenDeclinedModal(false);
    const handleDeleteConfirm = () => {
        axios.delete(`https://distromentor.onrender.com/dealer/deleteDealer/${dealerId}`)
            .then(response => {
                console.log('Dealer deleted successfully.');
            })
            .catch(error => {
                console.error('Error deleting dealer:', error);
            })
            .finally(() => {
                setIsDialogOpen(false);
            });
    };

    const handleDeleteConfirmed = () => {
        axios.delete(`https://distromentor.onrender.com/archived/deleteArchivedDealerById/${dealerId}`)
            .then(response => {
                console.log('Dealer deleted successfully.');
            })
            .catch(error => {
                console.error('Error deleting dealer:', error);
            })
            .finally(() => {
                setIsDialogOpen(false);
            });
    };

    const handleDeleteClick = (dealerId: string) => {
        setDealerId(dealerId);
        setIsDialogOpen(true);
    };

     const columnsOrder: GridColDef[] = [
         { field: 'id', headerName: 'Order ID', width: 150 },
         { field: 'orderDate', headerName: 'Order Date', width: 180 },
         { field: 'distributionDate', headerName: 'Distribution Date', width: 200 },
         { field: 'orderAmount', headerName: 'Order Amount', width: 170 },
         {
             field: 'orderStatus',
             headerName: 'Status',
             width: 170,
             renderCell: (params) => {
                 const statusColor: { [key: string]: string } = {
                     Open: 'green',
                     Pending: 'orange',
                     Closed: 'red',
                 };

                 const status = params.value as keyof typeof statusColor; // Ensure params.value is a valid key
                 return (
                     <span
                         style={{
                             color: statusColor[status] || 'black', // Default to black if status is unknown
                             fontWeight: 'bold',
                         }}
                     >
                         {params.value}
                     </span>
                 );
             },
         },
     ];

     const rowsOrder = orders.map((order) => ({
         id: order.orderid,
         orderDate: order.orderdate,
         distributionDate: order.distributiondate,
         orderAmount: `Php ${order.orderamount}`,
         orderStatus: order.status, // Pass status directly
     }));

    const columnsCustomerOrders: GridColDef[] = [
        { field: 'id', headerName: 'Order ID', width: 150 },
        { field: 'orderDate', headerName: 'Order Date', width: 180 },
        { field: 'customerName', headerName: 'Customer Name', width: 200 },
        { field: 'orderAmount', headerName: 'Order Amount', width: 170 },
        {
            field: 'orderStatus',
            headerName: 'Status',
            width: 170,
            renderCell: (params) => (
                <span
                    style={{
                        color:
                            params.value === 'Open'
                                ? 'green'
                                : params.value === 'Pending'
                                ? 'orange'
                                : 'red',
                        fontWeight: 'bold',
                    }}
                >
                    {params.value}
                </span>
            ),
        },
    ];

    const rowsCustomerOrders = customerOrders.map((order) => {
        console.log("Customer Order: ", order); // Debug each order object
        return {
            id: order.orderid,
            orderDate: order.orderdate
                ? moment(order.orderdate).format('YYYY-MM-DD') // Format date
                : 'N/A',
            customerName: order.customer
                ? `${order.customer.firstName ?? 'Unknown'} ${order.customer.lastName ?? ''}`
                : 'Unknown Customer',
            orderAmount: `Php ${order.orderamount?.toFixed(2) ?? '0.00'}`,
            orderStatus: order.status, // Use `status` from the order object
        };
    });



    return (
        <div>
            {dealer ? (
                <Grid style={{ position: 'relative', justifyContent: "center" }} container spacing={3}>
                    <Grid item style={{ marginRight: -70 }}>
                        <Grid>
                            <ProfileCard onClick={handleOpenProfile} style={{ cursor: 'pointer' }}>
                                <img src={imageSource} style={{ inset: 0, margin: 'auto', maxHeight: '100%', maxWidth: '100%' }}></img>
                            </ProfileCard>
                        </Grid>
                        <Grid>
                            <StyleLabel2>
                                <svg width="24" height="24" style={{ marginBottom: -5, marginRight: 16 }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.375 12.7393L10.682 20.4323C9.83811 21.2762 8.69351 21.7503 7.50003 21.7503C6.30655 21.7503 5.16195 21.2762 4.31803 20.4323C3.47411 19.5883 3 18.4437 3 17.2503C3 16.0568 3.47411 14.9122 4.31803 14.0683L15.258 3.12825C15.5367 2.84972 15.8675 2.6288 16.2315 2.47811C16.5956 2.32742 16.9857 2.24991 17.3797 2.25C17.7737 2.25009 18.1639 2.32779 18.5278 2.47865C18.8918 2.62951 19.2225 2.85059 19.501 3.12925C19.7796 3.40792 20.0005 3.73872 20.1512 4.10276C20.3019 4.4668 20.3794 4.85696 20.3793 5.25096C20.3792 5.64496 20.3015 6.03508 20.1506 6.39906C19.9998 6.76303 19.7787 7.09372 19.5 7.37225L8.55203 18.3203C8.26801 18.5925 7.88839 18.7413 7.49497 18.7363C7.10156 18.7313 6.72585 18.572 6.44883 18.2926C6.1718 18.0132 6.01564 17.6362 6.01399 17.2427C6.01234 16.8493 6.16535 16.4709 6.44003 16.1893L14.25 8.37925M8.56103 18.3103L8.55103 18.3203" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                Attachments
                            </StyleLabel2>
                        </Grid>
                        <Grid>
                            {dealerDocuments.map((document) => (
                                <div key={document.documentid} style={{ marginRight: '10px', marginBottom: '10px' }}>
                                    {displayFile(document.content, document.type, document.name, document.documentid, document.dealer!)}
                                </div>
                            ))}
                        </Grid>

                        <Modal open={openProfile} onClose={handleCloseDocument}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 300, marginTop: 40 }}>
                                    <ButtonClose variant='contained' onClick={handleCloseDocument}><CloseIcon /></ButtonClose>
                                </div>
                                <ModalCard>
                                    <img src={imageSource} style={{ position: 'absolute', inset: 0, margin: 'auto', maxHeight: '100%', maxWidth: '100%' }}></img>
                                </ModalCard>
                            </div>
                        </Modal>

                        <Modal open={open} onClose={handleCloseDocument}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 300, marginTop: 40 }}>
                                    <ButtonClose variant='contained' onClick={handleCloseDocument}><CloseIcon /></ButtonClose>
                                </div>
                                {selectedDocument && (
                                    <ModalCard>
                                        {selectedDocument.type === 'application/pdf' ? (
                                            <iframe
                                                title="PDF Document"
                                                src={`data:application/pdf;base64,${selectedDocument.content}`}
                                                width="100%"
                                                height="100%"
                                            />
                                        ) : selectedDocument.type.startsWith("image") ? (
                                            <img
                                                src={`data:${selectedDocument.type};base64,${selectedDocument.content}`}
                                                alt="Document"
                                                style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    margin: 'auto',
                                                    width: 'auto',
                                                    height: "100%"
                                                }}
                                            />
                                        ) : (
                                            <a href={`data:${selectedDocument.type};base64,${selectedDocument.content}`} download={`document.${selectedDocument.type}`}>
                                                Download Document
                                            </a>
                                        )}
                                    </ModalCard>
                                )}
                            </div>
                        </Modal>
                    </Grid>

                    <Grid item style={{ marginLeft: 15 }}>
                        <Grid container style={{ marginTop: -80 }}>
                            <Grid item>
                                <StyleMainLabel>Dealer's Name</StyleMainLabel>
                                <StyleMainInfo style={{ marginTop: 15 }}>{dealer?.firstname} {dealer?.middlename} {dealer?.lastname}</StyleMainInfo>
                            </Grid>
                            <Grid item>
                                <StyleMainLabel style={{ marginLeft: 91 }}>Dealer ID</StyleMainLabel>
                                <StyleMainInfo style={{ marginTop: 15, marginLeft: 111 }}>{dealer?.dealerid}</StyleMainInfo>
                            </Grid>

                            {dealer?.confirmed && (
                                <Grid item>
                                    <StyleMainLabel>
                                        Credit Limit
                                        {signedInDealer.tableName === 'Dealer' ? (
                                            <>
                                            </>
                                        ) : (
                                            <>
                                                {isEditIcon ? (
                                                    <svg
                                                        width="25"
                                                        height="25"
                                                        viewBox="0 0 33 33"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        style={{
                                                            marginLeft: 6,
                                                            marginBottom: -5,
                                                        }}
                                                        onClick={handleEditCreditLimit}
                                                    >
                                                        <path
                                                            d="M23.1852 6.16996L25.5049 3.84896C25.9884 3.36541 26.6443 3.09375 27.3281 3.09375C28.012 3.09375 28.6678 3.36541 29.1514 3.84896C29.6349 4.33252 29.9066 4.98836 29.9066 5.67221C29.9066 6.35607 29.6349 7.01191 29.1514 7.49547L14.5502 22.0966C13.8233 22.8231 12.9269 23.3571 11.9419 23.6503L8.25 24.7503L9.35 21.0585C9.64326 20.0735 10.1772 19.177 10.9037 18.4501L23.1852 6.16996ZM23.1852 6.16996L26.8125 9.79721M24.75 19.2503V25.7816C24.75 26.6021 24.4241 27.389 23.8439 27.9692C23.2637 28.5494 22.4768 28.8753 21.6562 28.8753H7.21875C6.39824 28.8753 5.61133 28.5494 5.03114 27.9692C4.45095 27.389 4.125 26.6021 4.125 25.7816V11.3441C4.125 10.5236 4.45095 9.73667 5.03114 9.15648C5.61133 8.57629 6.39824 8.25034 7.21875 8.25034H13.75"
                                                            stroke="#2D85E7"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <IconStyle2 onClick={handleCancelEdit}>
                                                        <CloseIcon style={{ marginTop: 5 }} />
                                                    </IconStyle2>
                                                )}
                                            </>
                                        )}
                                    </StyleMainLabel>

                                    {signedInDealer.tableName === 'Dealer' ? (
                                        <StyleMainInfo style={{ marginTop: 15 }}>
                                            Php {dealer?.creditlimit}
                                        </StyleMainInfo>
                                    ) : (
                                        <>
                                            {isEditing ? (
                                                <div>
                                                    <div
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: "1fr auto auto",
                                                            gridGap: "10px",
                                                            alignItems: "left",
                                                        }}
                                                    >
                                                        <input
                                                            type="number"
                                                            ref={creditLimitRef}
                                                            style={{
                                                                height: 20,
                                                                width: 120,
                                                                marginTop: 15,
                                                                marginLeft: 115,
                                                            }}
                                                        />
                                                        <div>
                                                            <ButtonCredit
                                                                variant="contained"
                                                                style={{ marginTop: 10 }}
                                                                onClick={() => handleUpdateCreditLimit(dealer!.dealerid)}
                                                            >
                                                                <CheckIcon style={{ color: '#2A9221' }} />
                                                            </ButtonCredit>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <StyleMainInfo style={{ marginTop: 15 }}>
                                                    Php {dealer?.creditlimit}
                                                </StyleMainInfo>
                                            )}
                                        </>
                                    )}
                                </Grid>
                            )}
                        </Grid>

                        <Grid container>
                            <Grid item>
                                <Box sx={{ width: 920, marginLeft: 10, marginTop: 5 }}>
                                    <Box sx={{ borderBottom: 0.5, borderColor: 'divider' }}>
                                        <Tabs value={value} onChange={handleChange} aria-label="Dealer Details Tabs">
                                            <TabStyle icon={<PermIdentityIcon />} iconPosition="start" label="Basic Information" {...a11yProps(0)} />
                                            <TabStyle icon={<WorkOutlineIcon />} iconPosition="start" label="Business Information" {...a11yProps(1)} />
                                            <TabStyle icon={<ReceiptLongOutlinedIcon />} iconPosition="start" label="Orders" {...a11yProps(2)} />
                                            <TabStyle icon={<PersonIcon />} iconPosition="start" label="Customer Orders" {...a11yProps(3)} />
                                        </Tabs>
                                    </Box>
                                    <CustomTabPanel value={value} index={0}>
                                        {/* Tab 0 Content */}
                                        <Grid container>
                                            <Grid item>
                                                <StyleLabel>Gender</StyleLabel>
                                                <StyleData>{dealer?.gender}</StyleData>
                                            </Grid>
                                            <Grid item>
                                                <StyleLabel style={{ marginLeft: -100 }}>Birthdate</StyleLabel>
                                                <StyleData style={{ marginLeft: -90 }}>{dealer?.birthdate}</StyleData>
                                            </Grid>
                                            <Grid item>
                                                <StyleLabel style={{ marginLeft: -80 }}>Contact Information</StyleLabel>
                                                <StyleData style={{ marginLeft: -70 }}>{dealer?.contactnumber}</StyleData>
                                            </Grid>
                                            <Grid item>
                                                <StyleLabel style={{ marginLeft: -20 }}>Email Address</StyleLabel>
                                                <StyleData style={{ marginLeft: -10 }}>{dealer?.emailaddress}</StyleData>
                                            </Grid>
                                        </Grid>
                                        <Grid container style={{ marginTop: 25 }}>
                                            <Grid item>
                                                <StyleLabel>Current Address</StyleLabel>
                                                <StyleData>{dealer?.currentaddress}</StyleData>
                                            </Grid>
                                            <Grid item>
                                                <StyleLabel>Permanent Address</StyleLabel>
                                                <StyleData>{dealer?.permanentaddress}</StyleData>
                                            </Grid>
                                            <Grid item>
                                                <StyleLabel style={{ marginLeft: 50 }}>Starting Date</StyleLabel>
                                                <StyleData style={{ marginLeft: 60 }}>{dealer?.submissiondate}</StyleData>
                                            </Grid>
                                        </Grid>
                                    </CustomTabPanel>

                                    <CustomTabPanel value={value} index={1}>
                                        {/* Tab 1 Content */}
                                        {business}
                                    </CustomTabPanel>

                                    <CustomTabPanel value={value} index={2}>
                                        {/* Tab 2 Content */}
                                        {dealer?.confirmed ? (
                                            rowsOrder.length > 0 ? (
                                                <div>
                                                    <DataGrid
                                                        rows={rowsOrder}
                                                        columns={columnsOrder}
                                                        initialState={{
                                                            pagination: {
                                                                paginationModel: {
                                                                    pageSize: 5,
                                                                },
                                                            },
                                                        }}
                                                        pageSizeOptions={[5]}
                                                        sx={{ cursor: "pointer" }} // Change cursor to pointer for better UX
                                                        onRowClick={(params) => navigate(`/orderTransactionDetails/${params.row.id}`)} // Navigate on row click
                                                    />
                                                </div>
                                            ) : (
                                                <Typography style={{ marginTop: 20, color: '#707070' }}>
                                                    No orders available.
                                                </Typography>
                                            )
                                        ) : (
                                            <Typography style={{ marginTop: 20, color: '#707070' }}>
                                                Orders will be available after confirmation.
                                            </Typography>
                                        )}
                                    </CustomTabPanel>


                                    <CustomTabPanel value={value} index={3}>
                                        {/* Tab 3 Content */}
                                        {dealer?.confirmed ? (
                                            customerOrders.length > 0 ? (
                                                <>
                                                    <DataGrid
                                                        sx={{
                                                            height: 370,
                                                            overflowX: 'hidden',
                                                            cursor: 'pointer', // Pointer cursor for better UX
                                                        }}
                                                        rows={rowsCustomerOrders}
                                                        columns={columnsCustomerOrders}
                                                        initialState={{
                                                            pagination: {
                                                                paginationModel: {
                                                                    pageSize: 5,
                                                                },
                                                            },
                                                        }}
                                                        pageSizeOptions={[5]}
                                                        onRowClick={(params) =>
                                                            navigate(`/customerTransaction/${params.row.id}`) // Navigate to customer transaction details
                                                        }
                                                    />
                                                </>
                                            ) : (
                                                <Typography style={{ marginTop: 20, color: '#707070' }}>
                                                    No customer orders available.
                                                </Typography>
                                            )
                                        ) : (
                                            <Typography style={{ marginTop: 20, color: '#707070' }}>
                                                Customer orders will be available after confirmation.
                                            </Typography>
                                        )}
                                    </CustomTabPanel>


                                    {/* Confirm/Decline Buttons */}
                                    {
                                        dealer?.confirmed === false && (
                                            <Grid container style={{ marginTop: 10, marginLeft: 280 }} spacing={5}>
                                                <Grid item>
                                                    <StyledButton
                                                        style={{ width: 120 }}
                                                        onClick={handleConfirmOpen}
                                                    >
                                                        <CheckIcon style={{ marginTop: -5, marginLeft: -3, height: 20, width: 'auto', color: 'rgb(116, 254, 189)', fontWeight: 'bolder' }} />
                                                        Confirm
                                                    </StyledButton>
                                                </Grid>
                                                <Grid item>
                                                    <StyledButton
                                                        style={{ width: 120 }}
                                                        onClick={handleDeclinedOpen}
                                                    >
                                                        <CloseIcon style={{ marginTop: -3, paddingLeft: -8, height: 20, width: 'auto', color: 'rgb(227, 80, 155)', fontWeight: 'bolder' }} />
                                                        Decline
                                                    </StyledButton>
                                                </Grid>
                                            </Grid>
                                        )
                                    }

                                    <Modal
                                        open={creditLimitModalOpen}
                                        onClose={handleConfirmClose}
                                        aria-labelledby="credit-limit-modal-title"
                                        aria-describedby="Credit Limit"
                                    >
                                        <Box sx={style}>
                                            <Typography
                                                style={{ color: "#2D85E7", fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}
                                                id="credit-limit-modal-title"
                                            >
                                                Set Credit Limit
                                            </Typography>
                                            <TextField
                                                label="Credit Limit"
                                                variant="filled"
                                                style={{ width: '400px' }}
                                                inputRef={creditLimitRef}
                                            />
                                            <StyledButton
                                                onClick={() => handleConfirmButton(dealer!.dealerid)}
                                                sx={{ marginTop: '20px', marginLeft: '150px' }}
                                            >
                                                Set
                                            </StyledButton>
                                        </Box>
                                    </Modal>

                                    <Modal
                                    open={openDeclinedModal}
                                    onClose={handleDeclinedClose}
                                    aria-labelledby="modal-title"
                                    aria-describedby="Comment"
                                    >
                                    <Box sx={style}>
                                        <Typography style={{ color: "#2D85E7", fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }} id="decline-modal-title"> Reasons </Typography>
                                        <TextField
                                            label="State the Reason for Decline"
                                            multiline
                                            rows={4}
                                            variant="filled"
                                            style={{ width: '400px' }}
                                            inputRef={declineReasonRef}
                                        />
                                        <StyledButton onClick={() => handleDeclineClick(dealer!.dealerid)}
                                            sx={{ marginTop: '20px', marginLeft: '150px' }}>
                                            Submit
                                        </StyledButton>
                                    </Box>
                                </Modal>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Alerts */}
                    <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }} TransitionComponent={SlideTransitionDown}>
                        <Alert onClose={handleCloseAlert} severity={alertSeverity as 'success' | 'warning' | 'error'} sx={{ width: 500 }} >
                            <AlertTitle style={{ textAlign: 'left', fontWeight: 'bold' }}>{alerttitle}</AlertTitle>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
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
                        style={{ width: 450 }}
                        theme="colored"
                    />
                </Grid>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh', marginTop: '-20px' }}>
                    <img src={logo5} alt="Logo" style={{ width: '375px', marginBottom: '-40px' }} />
                    <LinearProgress sx={{ width: '20%' }} />
                </Box>
            )}
        </div>
    );
};

export default DealerProfileDetails;
