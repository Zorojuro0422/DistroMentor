import { Box, Button, Collapse, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, styled } from "@mui/material"

import { ExpandLess, ExpandMore, Height, StarBorder } from '@mui/icons-material/';
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom";
// import logo from "./logo.png"
import logo1 from ".Images/logo1.png"
import logo2 from ".Images/logo2.png"
import logo3 from ".Images/logo3.png"
import logo7 from "./Images/logo7.png"

{/** Functions for page routing */ }
type navProps = {
    moduleName: String;
}

interface StyledButtonProps {
    selected: boolean;
}
interface StyledButtonProps1 {
    selected1: boolean;
}

{/** Styled box for background color of drawer */ }
const ColorBox = styled(Box)({
    background: 'linear-gradient(to right bottom, #004AAD, #5DE0E6)',
    // backgroundColor:'#2D85E7',
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

})

{/** Styled typo for app name */ }
const AppNameTypography = styled(Typography)({
    marginTop: '-65px',
    marginBottom: '-70px',
    marginLeft: '-78%',
    marginRight: '-68%',
    alignItems: 'center',
    fontFamily: 'Inter, Sans-serif',
    fontSize: '35px'
})
{/** Styled item labels in drawer */ }
const StyledText = styled(ListItemText)<StyledButtonProps>(({ selected }) => ({
    marginTop: 10,
    marginLeft: 20,
    color: selected ? '#2D85E7' : '#FFFFFF',
    fontSize: '20px',
    fontFamily: 'Inclusive Sans, sans-serif',
    '& .MuiTypography-body1': {
        fontSize: '15px',
    },

}))
const StyledText1 = styled(ListItemText)<StyledButtonProps1>(({ selected1 }) => ({
    marginTop: 10,
    marginLeft: 20,
    color: selected1 ? '#2D85E7' : '#FFFFFF',
    fontSize: '20px',
    fontFamily: 'Inclusive Sans, sans-serif',
    '& .MuiTypography-body1': {
        fontSize: '15px',
    },

}))
{/** Styled list items in the drawer */ }
const StyledListItem = styled(ListItem)({
    marginLeft: '-35px',
    marginBottom: 8,
})

const StyledButton = styled(Button)<StyledButtonProps>(({ selected }) => ({
    marginLeft: -1,
    width: 390,
    height: 60,
    ':hover': {
        backgroundColor: 'rgb(135, 186, 243, 0.5)',
    },
    backgroundColor: selected ? '#f5f5f5' : '',
    borderRadius: selected ? '100px 0px 0px 100px' : '0px 0px 0px 0px ',
}))
const StyledButton1 = styled(Button)<StyledButtonProps1>(({ selected1 }) => ({
    marginLeft: -1,
    width: 390,
    height: 60,
    ':hover': {
        backgroundColor: 'rgb(135, 186, 243, 0.5)',
    },
    backgroundColor: selected1 ? '#f5f5f5' : '',
    borderRadius: selected1 ? '100px 0px 0px 100px' : '0px 0px 0px 0px ',
}))


export default function NewNavBar() {

    const navigate = useNavigate();
    const route = useLocation();
    {/** For Payments Drop Down */ }
    const [dropDownPayments, setDropDownPayments] = useState(false);
    const [dropDownProfiles, setDropDownProfiles] = useState(false);
    const [dropDownProducts, setDropDownProducts] = useState(false);
    const [selectedButton, setSelectedButton] = useState<number | null>(null);
    const [selectedButton1, setSelectedButton1] = useState<number | null>(null);
    const [iconColor, setIconColor] = useState('#FFFFFF')

    function handleDropDownPayments() {
        setDropDownPayments(!dropDownPayments);
        setDropDownProfiles(false);
        setDropDownProducts(false);
        handleButtonClick(6)
    }


    {/** For Profiles Drop Down */ }
    function handleDropDownProfiles() {
        setDropDownProfiles(!dropDownProfiles);
        setDropDownPayments(false);
        setDropDownProducts(false);
        handleButtonClick(2)
    }

    {/** For Products Drop Down */ }
    function handleDropDownProducts() {
        setDropDownProducts(!dropDownProducts);
        setDropDownProfiles(false);
        setDropDownPayments(false);
        handleButtonClick(3)
    }

    const handleButtonClick = (buttonId: number) => {
        setSelectedButton(buttonId === selectedButton ? buttonId : buttonId);

        if (buttonId === 7) {
            localStorage.clear();
            navigate("/SignIn")
        }


    }
    const handleButtonClick1 = (buttonId1: number) => {
        setSelectedButton1(buttonId1 === selectedButton1 ? null : buttonId1);
    }


    const getIconColor = (buttonId: number): string => {
        return buttonId === selectedButton ? '#2D85E7' : '#FFFFFF';
    }

    const handleCloseDropDownList = () => {
        setDropDownProfiles(false);
        setDropDownPayments(false);
        setDropDownProducts(false);
    }
    const homeHandler=()=>{
        navigate(`/dashboard`)
       }

    return (
        <div>
            <Drawer open={true} variant="permanent">
                <ColorBox onMouseLeave={handleCloseDropDownList}>
                    <AppNameTypography ><img src={logo7} onClick={homeHandler} style={{ height: '230px', width: 'auto', cursor:'pointer' }} /></AppNameTypography>
                    <List>
                        {/** Home */}
                        <Link to="/dashboard">
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
                        {/** Profiles */}
                        <StyledButton onClick={handleDropDownProfiles} selected={selectedButton === 2} >
                            <StyledListItem>
                                <ListItemIcon>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={getIconColor(2)} className="w-6 h-6" style={{ marginLeft: 23, width: 25, height: 25 }}>
                                        <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                                        <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                                    </svg>
                                </ListItemIcon>
                                <StyledText selected={selectedButton === 2} primary="Profiles" />
                                {dropDownProfiles ? <ExpandLess sx={{ fill: '#FFFFFF' }} /> : <ExpandMore sx={{ fill: '#FFFFFF' }} />}
                            </StyledListItem>
                        </StyledButton>
                        <Collapse in={dropDownProfiles} timeout="auto" unmountOnExit>
                            <List>
                                <Link to="/dealerProfileList">
                                    <StyledButton1 onClick={() => handleButtonClick1(1)} selected1={selectedButton1 === 1}>
                                        <StyledText1 selected1={selectedButton1 === 1} sx={{ marginLeft: -2 }} primary="Dealer Profiles List" />
                                    </StyledButton1>
                                </Link>
                            </List>
                        </Collapse>
                        {/** Products */}
                        <StyledButton1 onClick={handleDropDownProducts} selected1={selectedButton === 3}>
                            <StyledListItem>
                                <ListItemIcon>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={getIconColor(3)} className="w-6 h-6" style={{ marginLeft: 23, width: 25, height: 25 }}>
                                        <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
                                    </svg>
                                </ListItemIcon>
                                <StyledText selected={selectedButton === 3} primary="Products" />
                                {dropDownProducts ? <ExpandLess sx={{ fill: '#FFFFFF' }} /> : <ExpandMore sx={{ fill: '#FFFFFF' }} />}
                            </StyledListItem>
                        </StyledButton1>
                        <Collapse in={dropDownProducts} timeout="auto" unmountOnExit>
                            <List>
                                <Link to="/AddProductUI">
                                    <StyledButton1 onClick={() => handleButtonClick1(5)} selected1={selectedButton1 === 5}>
                                        <StyledText1 selected1={selectedButton1 === 5} sx={{ marginLeft: 3 }} primary="Product Entry" />
                                    </StyledButton1>
                                </Link>
                                <Link to="/productDistributionList">
                                    <StyledButton1 onClick={() => handleButtonClick1(4)} selected1={selectedButton1 === 4}>
                                        <StyledText1 selected1={selectedButton1 === 4} sx={{ marginLeft: 5 }} primary="Product Distribution List" />
                                    </StyledButton1>
                                </Link>
                                <Link to="/distributorOrderForm">
                                    <StyledButton1 onClick={() => handleButtonClick1(5)} selected1={selectedButton1 === 5}>
                                        <StyledText1 selected1={selectedButton1 === 5} sx={{ marginLeft: 3 }} primary="Distributor Order Form" />
                                    </StyledButton1>
                                </Link>
                            </List>
                        </Collapse>
                        {/** Payments */}
                        <Link to="/paymentList">
                            <StyledButton onClick={() => handleButtonClick(6)} selected={selectedButton === 6}>
                                <StyledListItem>
                                    <ListItemIcon>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={getIconColor(6)} className="w-6 h-6" style={{ marginLeft: 23, width: 25, height: 25 }}>
                                            <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                                            <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                                            <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                                        </svg>
                                    </ListItemIcon>
                                    <StyledText selected={selectedButton === 6} primary="Payments" />
                                </StyledListItem>
                            </StyledButton>
                        </Link>
                        {/** Sales */}
                        <Link to="/paymentList">
                        <StyledButton onClick={() => handleButtonClick(7)} selected={selectedButton === 7}>
                                <StyledListItem>
                                    <ListItemIcon>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={getIconColor(7)} className="w-6 h-6" style={{ marginLeft: 23, width: 25, height: 25 }}>
                                            <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                                            <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                                            <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                                        </svg>
                                    </ListItemIcon>
                                    <StyledText selected={selectedButton === 7} primary="Sales" />
                                </StyledListItem>
                            </StyledButton>
                        </Link>

                        {/** Sign out */}
                        <StyledButton onClick={() => handleButtonClick(8)} selected={selectedButton === 8} sx={{ marginTop: 5 }}>
                            <StyledListItem>
                                <ListItemIcon>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFFFFF" className="w-6 h-6" style={{ marginLeft: 23, width: 25, height: 25 }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                    </svg>
                                </ListItemIcon>
                                <StyledText selected={selectedButton === 8} primary="Sign out" />
                            </StyledListItem>
                        </StyledButton>
                    </List>
                </ColorBox>
            </Drawer>
        </div>
    );
}