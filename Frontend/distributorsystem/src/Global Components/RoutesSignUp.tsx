import { Navigate, Route, Routes } from "react-router-dom";
import Content from "./Contents";

import SignupScreen from "../Components/B - Registration(SplashScreen)/SignupScreen";
import SignUpContent from "./ContentsSignIn";
import NewDealerRegistration from "../Components/Module 2 - Registrations/DealerRegistrationUI";
import MainRoutes from "./Routes";
import NewNavBar from "./NewNavBar";
import { Dashboard } from "@mui/icons-material";
import DealerOrderForm from "../Components/Module 5 - Product Distribution and Confirmation/DealerOrderFormUI";
import DistributorOrderForm from "../Components/Module 5 - Product Distribution and Confirmation/DistributorOrderFormUI";
import DealerProfile from "../Components/Module 4 - Profiles & Approval/DealerProfilesListUI";
import DealerRegistration from "../Components/Module 2 - Registrations/DealerRegistrationUI";
import Schedules from "../Components/Module 7 - Schedules/ScheduleOrderTransactionUI";
import SignIn from "../Components/Module 1 - Distributor System Sign-in/SignInUI";
import DealerApproval from "../Components/Module 4 - Profiles & Approval/DealerApproval";
import { OrderDetails } from "../Components/Module 6 - Collector Assignment/OrderDetails";

import SignInContent from "./ContentsSignIn";
import CollectorAssignment from "../Components/Module 6 - Collector Assignment/CollectorAssignmentUI";

export default function SignUpRoutes(){
    return(
        <Routes>
            <Route path="/" element={<SignInContent/>}>
                <Route path="/" element={<Navigate replace to="SignIn"/>}/>
                 {/* <SignupScreen/> */}
                <Route path="/SignUpScreen" element={<SignupScreen/>}/>
                <Route path="/newDealerRegistration" element={<NewDealerRegistration/>}/>
                 {/* <SignInScreen/> */}
                <Route path="/SignIn" element={<SignIn/>}/>
                     {/* <Main Routes/> */}
                    <Route path="/" element={<Content/>}>
                            <Route path="/" element={<Navigate replace to="dashboard"/>}/>
                            <Route path="/dashboard" element={<Dashboard/>}/>
                            <Route path="/dealearOrderForm" element={<DealerOrderForm/>}/>
                            <Route path="/distributorOrderForm" element={<DistributorOrderForm/>}/>
                            <Route path="/dealerProfile" element={<DealerProfile/>}/>        
                            <Route path="/dealerRegistration" element={<DealerRegistration/>}/>
                            <Route path="/schedules" element={<Schedules/>}/>
                            <Route path="/signin" element={<SignIn/>}/>
                            <Route path="/dealerApproval" element={<DealerApproval/>}/>
                            <Route path="/collectorAssignment" element={<CollectorAssignment/>}/>
                            <Route path="/orderDetails/:objectId" element={<OrderDetails/>}/>

                    </Route>
            </Route>  
        </Routes>
    );
}