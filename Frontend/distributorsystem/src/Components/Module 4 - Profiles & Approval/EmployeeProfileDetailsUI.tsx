import { Alert, AlertTitle, Box, Button, Card, Grid, Icon, LinearProgress, Modal, Slide, SlideProps, Snackbar, Stack, Tab, Tabs, Typography, styled } from "@mui/material";
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import PersonIcon from '@mui/icons-material/Person';
import profilepicture from "../../Global Components/Images/profilepicture.png"
import { IEmployee, IEmployeeDocument } from "../../RestCalls/Interfaces";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { useRestEmployee } from "../../RestCalls/EmployeeUseRest";
import logo5 from '../../Global Components/Images/logo5.png';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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
const ProfileCard = styled(Card)({
  display: 'flex',
  borderRadius: 22,
  width: 300,
  height: 240,
  marginTop: 60,
  marginLeft: 160
})
const StyleMainInfo = styled(Typography)({
  //display:'flex',
  position: 'relative',
  fontWeight: '550',
  textAlign: 'left',
  marginLeft: 110,
  marginRight: 10,

  // left: 565,
  // top: 220,
  color: '#203949',
  fontSize: '18px',
  fontFamily: 'Inter',
})

const StyldeInfoHeader = styled(Typography)({
  marginTop: '-45px',
  marginBottom: '100px',
  marginLeft: '26%',
  fontFamily: 'Inter',
  fontWeight: 'bold',
  textAlign: 'left',
  fontSize: '25px',
  color: '#203949'
})
const StackStyle = styled(Stack)({
  position: 'absolute',
  top: '230px',
  left: '-12%',
  fontFamily: 'Inter',

})
const StyleLabel = styled(Typography)({
  // position: 'absolute',
  textAlign: 'left',
  fontWeight: '550',
  // left: '165px',
  marginTop: 40,
  marginLeft: 10,
  color: '#707070',
  fontSize: '17px',
  width: 'max-content',
  fontFamily: 'Inter',
})
const StyleData = styled(Typography)({
  textAlign: 'left',
  width: 250,
  marginLeft: 30,
  marginTop: 15,
  color: '#203949',
  fontSize: '17px',
  fontFamily: 'Inter, sans - serif',
})

const StyleMainLabel = styled(Typography)({
  //display:'flex',
  marginTop: 160,
  textAlign: 'left',
  fontWeight: '550',
  marginLeft: 90,
  marginRight: 50,
  color: '#707070',
  fontSize: '18px',
  fontFamily: 'Inter',
})

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
})
const ButtonClose = styled(Button)({
  backgroundColor: '#E77D7D',
  width: 40,
  height: 40,
  ':hover': {
      backgroundColor: 'red',
      transform: 'scale(1.1)'
  },
  transition: 'all 0.4s'
})






export function EmployeeProfileDetails() {
  const [newEmployee, getEmployeeByID, getCollectorByID, employee] = useRestEmployee();
  //const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [employeeDocuments, setEmployeeDocuments] = useState<IEmployeeDocument[]>([]);
  const [value, setValue] = useState(0);
  const [openProfile, setOpenProfile] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alerttitle, setTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  // Use useParams to get the employee from the URL
  const { objectId } = useParams();
  const handleFindEmployee = () => {
    getEmployeeByID(objectId!);
  };

  function getAllEmployeeDocuments() {
    axios.get<IEmployeeDocument[]>(`https://distromentor.onrender.com/employeeDocument/findAllDocumentsByEmployeeId/${objectId!}`)
      .then((response) => {
        setEmployeeDocuments(response.data);
      })
      .catch((error) => {

      
      });
  };

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
          <Box sx={{ p: 1 }}>
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
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    };


  useEffect(() => {
    
    if (objectId !== null) {
      handleFindEmployee();
      getAllEmployeeDocuments();
    }
  }, [objectId, employee, employeeDocuments]);

  const profilePic = employeeDocuments.find(image => image.name === employee?.lastname + '_profilepicture');
  const imageSource = profilePic ? `data:${profilePic?.type} ;base64,${profilePic?.content}`
    : profilepicture
  const handleOpenProfile = () => {
    setOpenProfile(true);
  }
  const handleCloseDocument = () => {
    setOpenProfile(false)
}
  return (
    <div>
       {employee?(
        
      <Grid  style={{ position:'relative', justifyContent: "center"}} container spacing={3}>
        <Grid item style={{ marginRight: -70 }}>
          <Grid>
            <ProfileCard onClick={handleOpenProfile} style={{cursor:'pointer'}}>
              <img src={imageSource} style={{ inset: 0, margin: 'auto', maxHeight: '100%', maxWidth: '100%' }}></img>
            </ProfileCard>
          </Grid>
        </Grid>
        <Modal
          open={openProfile}
          onClose={handleCloseDocument}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 300, marginTop: 40 }}>
              <ButtonClose variant='contained' onClick={handleCloseDocument}><CloseIcon /></ButtonClose>
            </div>
            <ModalCard>
              <img src={imageSource} style={{ position: 'absolute', inset: 0, margin: 'auto', maxHeight: '100%', maxWidth: '100%' }}></img>
            </ModalCard>
          </div>
        </Modal>
        <Grid item>
          <Grid container style={{ marginTop: -80 }}>
            <Grid item>
              <StyleMainLabel>Employee's Name</StyleMainLabel>
              <StyleMainInfo style={{ marginTop: 15 }}>{employee?.firstname} {employee?.middlename} {employee?.lastname}</StyleMainInfo>
            </Grid>
            <Grid item>
              <StyleMainLabel style={{marginLeft:70}}>Employee ID</StyleMainLabel>
              <StyleMainInfo style={{ marginTop: 15, marginLeft: 90}}>{employee?.employeeid}</StyleMainInfo>
            </Grid>
            <Grid item>
              <StyleMainLabel style={{marginLeft:70}}>Position</StyleMainLabel>
              <StyleMainInfo style={{ marginTop: 15, marginLeft: 90 }}>
                {employee?.iscashier && "Cashier"}
                {employee?.iscollector && (employee!.iscashier ? ', Collector' : 'Collector')}
                {employee?.issalesassociate && (employee?.iscashier || employee?.iscollector ? ', Sales Associate' : 'Sales Associate')}
              </StyleMainInfo>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item>
              <Box sx={{ width: 920, marginLeft: 10, marginTop: 5 }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
                  <TabStyle icon={<PermIdentityIcon />} iconPosition="start" label="Basic Information" {...a11yProps(0)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                {/* Basic Information */}
                <Grid container>
                  <Grid item style={{  marginLeft: 80  }}>
                    <StyleLabel>Gender</StyleLabel>
                    <StyleData>{employee?.gender}</StyleData>
                  </Grid>
                  <Grid item>
                    <StyleLabel style={{ marginLeft: -100 }}>Birthdate</StyleLabel>
                    <StyleData style={{ marginLeft: -90 }}>{employee?.birthdate}</StyleData>
                  </Grid>
                  <Grid item>
                    <StyleLabel style={{ marginLeft: -80 }}>Contact Information</StyleLabel>
                    <StyleData style={{ marginLeft: -70 }}>{employee?.contactnumber}</StyleData>
                  </Grid>
                  <Grid item>
                    <StyleLabel style={{ marginLeft: -20 }}>Email Address</StyleLabel>
                    <StyleData style={{ marginLeft: -10 }}>{employee?.emailaddress}</StyleData>
                  </Grid>
                </Grid>
                <Grid container style={{ marginTop: 25, marginLeft: 80 }}>
                  <Grid item>
                    <StyleLabel>Current Address</StyleLabel>
                    <StyleData>{employee?.currentaddress}</StyleData>
                  </Grid>
                  <Grid item>
                    <StyleLabel>Permanent Address</StyleLabel>
                    <StyleData>{employee?.permanentaddress}</StyleData>
                  </Grid>
                  <Grid item>
                    <StyleLabel style={{ marginLeft: 50 }}>TIN Number</StyleLabel>
                    <StyleData style={{ marginLeft: 60 }}>{employee.tinnumber}</StyleData>
                  </Grid>
                </Grid>
              </CustomTabPanel>


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
      </Grid>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh', marginTop: '-20px' }}>
            <img src={logo5} alt="Logo" style={{ width: '375px', marginBottom: '-40px' }} />
            <LinearProgress sx={{ width: '20%' }} />
            {/* You can adjust the width as needed */}
        </Box>
    )}
    </div>
  );

}