import {
    Box, Button, Collapse, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, styled
} from "@mui/material";
import { ExpandLess, ExpandMore } from '@mui/icons-material/';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo7 from "./Images/logo7.png";

type NavProps = {
    moduleName: string; // Changed to lowercase `string` to align with TypeScript conventions
};

interface StyledButtonProps {
    selected: boolean;
}
interface StyledButtonProps1 {
    selected1: boolean;
}

const ColorBox = styled(Box)({
    background: 'linear-gradient(to right bottom, #004AAD, #5DE0E6)',
    width: '80px',
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    transition: "ease-in-out 0.3s",
    overflow: 'hidden',
    ':hover': {
        width: '360px',
        height: '100vh',
    },
});

const AppNameTypography = styled(Typography)({
    marginTop: '-65px',
    marginBottom: '-70px',
    marginLeft: '-78%',
    marginRight: '-68%',
    alignItems: 'center',
    fontFamily: 'Inter, Sans-serif',
    fontSize: '35px'
});

const StyledText = styled(ListItemText)<StyledButtonProps>(({ selected }) => ({
    marginTop: 10,
    marginLeft: 20,
    color: selected ? '#2D85E7' : '#FFFFFF',
    fontSize: '20px',
    fontFamily: 'Inclusive Sans, sans-serif',
    '& .MuiTypography-body1': {
        fontSize: '15px',
    },
}));

const StyledText1 = styled(ListItemText)<StyledButtonProps1>(({ selected1 }) => ({
    marginTop: 10,
    marginLeft: 20,
    color: selected1 ? '#2D85E7' : '#FFFFFF',
    fontSize: '20px',
    fontFamily: 'Inclusive Sans, sans-serif',
    '& .MuiTypography-body1': {
        fontSize: '15px',
    },
}));

const StyledListItem = styled(ListItem)({
    marginLeft: '-35px',
    marginBottom: 8,
});

const StyledButton = styled(Button)<StyledButtonProps>(({ selected }) => ({
    marginLeft: -1,
    width: 390,
    height: 60,
    ':hover': {
        backgroundColor: 'rgb(135, 186, 243, 0.5)',
    },
    backgroundColor: selected ? '#f5f5f5' : '',
    borderRadius: selected ? '100px 0px 0px 100px' : '0px 0px 0px 0px ',
}));

const StyledButton1 = styled(Button)<StyledButtonProps1>(({ selected1 }) => ({
    marginLeft: -1,
    width: 390,
    height: 60,
    ':hover': {
        backgroundColor: 'rgb(135, 186, 243, 0.5)',
    },
    backgroundColor: selected1 ? '#f5f5f5' : '',
    borderRadius: selected1 ? '100px 0px 0px 100px' : '0px 0px 0px 0px ',
}));

export default function NewNavBarDealer({ moduleName }: NavProps) {
    const navigate = useNavigate();
    const [dropDownPayments, setDropDownPayments] = useState(false);
    const [dropDownProfiles, setDropDownProfiles] = useState(false);
    const [dropDownProducts, setDropDownProducts] = useState(false);
    const [selectedButton, setSelectedButton] = useState<number | null>(null);
    const [selectedButton1, setSelectedButton1] = useState<number | null>(null);

    function handleDropDownPayments() {
        setDropDownPayments(!dropDownPayments);
        setDropDownProfiles(false);
        setDropDownProducts(false);
        handleButtonClick(6);
    }

    function handleDropDownProfiles() {
        setDropDownProfiles(!dropDownProfiles);
        setDropDownPayments(false);
        setDropDownProducts(false);
        handleButtonClick(2);
    }

    function handleDropDownProducts() {
        setDropDownProducts(!dropDownProducts);
        setDropDownProfiles(false);
        setDropDownPayments(false);
        handleButtonClick(3);
    }

    const handleButtonClick = (buttonId: number) => {
        setSelectedButton(buttonId);
    };

    const handleButtonClick1 = (buttonId1: number) => {
        setSelectedButton1(buttonId1 === selectedButton1 ? buttonId1 : buttonId1);
    };

    const getIconColor = (buttonId: number): string => {
        return buttonId === selectedButton ? '#2D85E7' : '#FFFFFF';
    };

    const handleCloseDropDownList = () => {
        setDropDownProfiles(false);
        setDropDownPayments(false);
        setDropDownProducts(false);
    };

    const homeHandler = () => {
        navigate(`/dashboard`);
    };

    return (
        <div>
            <Drawer open={true} variant="permanent">
                <ColorBox onMouseLeave={handleCloseDropDownList}>
                    <AppNameTypography>
                        <img
                            src={logo7}
                            onClick={homeHandler}
                            style={{ height: '230px', width: 'auto', cursor: 'pointer' }}
                        />
                    </AppNameTypography>

                    {/* Home */}
                    <List>
                        <Link to="/dealerdashboard">
                            <StyledButton onClick={() => handleButtonClick(1)} selected={selectedButton === 1} focusRipple>
                                <StyledListItem>
                                    <ListItemIcon sx={{ left: 200 }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={getIconColor(1)} className="w-6 h-6" style={{ marginLeft: 23, width: 25, height: 25 }}>
                                            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                                            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                                        </svg>
                                    </ListItemIcon>
                                    <StyledText selected={selectedButton === 1} primary="Home" />
                                </StyledListItem>
                            </StyledButton>
                        </Link>

                        {/* Inventory */}
                        <Link to="/dealerProduct">
                            <StyledButton
                                onClick={() => handleButtonClick(2)}
                                selected={selectedButton === 2}
                                focusRipple
                            >
                                <StyledListItem>
                                    <ListItemIcon sx={{ left: 200 }}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill={getIconColor(2)}
                                            className="w-6 h-6"
                                            style={{ marginLeft: 23, width: 25, height: 25 }}
                                        >
                                            <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                                            <path
                                                fillRule="evenodd"
                                                d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </ListItemIcon>
                                    <StyledText selected={selectedButton === 2} primary="Inventory" />
                                </StyledListItem>
                            </StyledButton>
                        </Link>

                        {/* Stock Request Dropdown */}
                        <Link to="/dealerOrderForm">
                            <StyledButton
                                onClick={() => handleButtonClick(3)}
                                selected={selectedButton === 3}
                                focusRipple
                            >
                                <StyledListItem>
                                    <ListItemIcon>
                                        <svg
                                           xmlns="http://www.w3.org/2000/svg"
                                           fill="none"
                                           viewBox="0 0 24 24"
                                           strokeWidth="1.5"
                                           stroke={selectedButton === 3 ? "#2D85E7" : "white"} // Match text color when selected
                                           className="size-6"
                                           style={{ marginLeft: 23, width: 25, height: 25 }}
                                       >
                                           <path
                                               strokeLinecap="round"
                                               strokeLinejoin="round"
                                               d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                                           />
                                       </svg>
                                   </ListItemIcon>
                                    <StyledText selected={selectedButton === 3} primary="Stock Request" />
                                </StyledListItem>
                            </StyledButton>
                        </Link>

                        {/* Sales Dropdown */}
                        <StyledButton
                            onClick={() => {
                                setDropDownPayments(!dropDownPayments); // Toggle dropdown state for Sales
                                handleButtonClick(4); // Set unique ID for Sales
                            }}
                            selected={selectedButton === 4}
                            focusRipple
                        >
                            <StyledListItem>
                                <ListItemIcon>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        strokeWidth="1.5"
                                        stroke={selectedButton === 4 ? "#2D85E7" : "white"} // Match text color when selected
                                        className="size-6"
                                        style={{ marginLeft: 23, width: 25, height: 25 }}
                                    >
                                        <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </ListItemIcon>
                                <StyledText selected={selectedButton === 4} primary="Sales" />
                                {dropDownPayments ? <ExpandLess sx={{ fill: "#FFFFFF" }} /> : <ExpandMore sx={{ fill: "#FFFFFF" }} />}
                            </StyledListItem>
                        </StyledButton>

                        {/* Dropdown Items */}
                        <Collapse in={dropDownPayments} timeout="auto" unmountOnExit>
                            <List>
                                <Link to="/customercollection">
                                    <StyledButton1
                                        onClick={() => setSelectedButton1(1)}
                                        selected1={selectedButton1 === 1}
                                        focusRipple
                                    >
                                        <StyledText1 selected1={selectedButton1 === 1} primary="Invoices" />
                                    </StyledButton1>
                                </Link>
                                <Link to="/customerOrderForm">
                                    <StyledButton1
                                        onClick={() => setSelectedButton1(2)}
                                        selected1={selectedButton1 === 2}
                                        focusRipple
                                    >
                                        <StyledText1 selected1={selectedButton1 === 2} primary="Invoices Entry" />
                                    </StyledButton1>
                                </Link>
                            </List>
                        </Collapse>


                        {/* Dealers Dropdown */}
                        <StyledButton
                            onClick={() => {
                                setDropDownProducts(!dropDownProducts); // Toggle dropdown state for Dealers
                                handleButtonClick(5); // Select the Dealers button
                            }}
                            selected={selectedButton === 5}
                            focusRipple
                        >
                            <StyledListItem>
                                <ListItemIcon>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke={selectedButton === 5 ? "#2D85E7" : "white"} // Match text color when selected
                                        className="size-6"
                                        style={{ marginLeft: 23, width: 25, height: 25 }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                                        />
                                    </svg>
                                </ListItemIcon>
                                <StyledText selected={selectedButton === 5} primary="Customers" />
                                {dropDownProducts ? <ExpandLess sx={{ fill: "#FFFFFF" }} /> : <ExpandMore sx={{ fill: "#FFFFFF" }} />}
                            </StyledListItem>
                        </StyledButton>

                        {/* Dropdown Items */}
                        <Collapse in={dropDownProducts} timeout="auto" unmountOnExit>
                            <List>
                                <Link to="/customerlist">
                                    <StyledButton1
                                        onClick={() => setSelectedButton1(3)}
                                        selected1={selectedButton1 === 3}
                                        focusRipple
                                    >
                                        <StyledText1 selected1={selectedButton1 === 3} primary="Customer List" />
                                    </StyledButton1>
                                </Link>
                                <Link to="/customerRegistration">
                                    <StyledButton1
                                        onClick={() => setSelectedButton1(4)}
                                        selected1={selectedButton1 === 4}
                                        focusRipple
                                    >
                                        <StyledText1 selected1={selectedButton1 === 4} primary="Customer Registration" />
                                    </StyledButton1>
                                </Link>
                            </List>
                        </Collapse>

                        {/* Deposit Button */}
                        <Link to="/payment">
                            <StyledButton
                                onClick={() => handleButtonClick(6)}
                                selected={selectedButton === 6}
                                focusRipple
                            >
                                <StyledListItem>
                                    <ListItemIcon sx={{ left: 200 }}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill={selectedButton === 6 ? "#2D85E7" : "white"}
                                            className="size-6"
                                            style={{ marginLeft: 23, width: 25, height: 25 }}
                                        >
                                            <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z"
                                                clipRule="evenodd"
                                            />
                                            <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
                                        </svg>
                                    </ListItemIcon>
                                    <StyledText selected={selectedButton === 6} primary="Deposit" />
                                </StyledListItem>
                            </StyledButton>
                        </Link>
                    </List>
                </ColorBox>
            </Drawer>
        </div>
    );
}
