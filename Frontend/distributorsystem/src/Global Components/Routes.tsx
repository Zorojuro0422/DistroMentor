import { Routes, Route, Navigate  } from 'react-router-dom'


// import DealerProfileList from "./Components/Profiles/DealerProfiles/DealerProfileList";
import DealerRegistration from "../Components/Module 2 - Registrations/DealerRegistrationUI";
import Schedules from "../Components/Module 7 - Schedules/ScheduleOrderTransactionUI";
import DistributorOrderForm from "../Components/Module 5 - Product Distribution and Confirmation/DistributorOrderFormUI";
import DealerOrderForm from "../Components/Module 5 - Product Distribution and Confirmation/DealerOrderFormUI";
import SignIn from "../Components/Module 1 - Distributor System Sign-in/SignInUI";
import Content from "./Contents";

import DealerProfile from '../Components/Module 4 - Profiles & Approval/DealerProfilesListUI';
import DealerApproval from '../Components/Module 4 - Profiles & Approval/DealerApproval';
import ProductDistributionList from '../Components/Module 5 - Product Distribution and Confirmation/ProductDistributionsListUI';
import { OrderDetails } from '../Components/Module 6 - Collector Assignment/OrderDetails';


import SignupScreen from '../Components/B - Registration(SplashScreen)/SignupScreen';
import SignInContent from './ContentsSignIn';
import SignUpContent from './ContentsSignUp';
import SplashscreenContent from './ContentsSplashscreen';
import WelcomeScreen from '../Components/A - SplashScreen/WelcomeScreen';
import DealerProfileDetails from '../Components/Module 4 - Profiles & Approval/DealerProfileDetailsUI';
import CollectorAssignment from '../Components/Module 6 - Collector Assignment/CollectorAssignmentUI';
import DealerProfileListUI from '../Components/Module 4 - Profiles & Approval/DealerProfilesListUI';
import OrderConfirmation from '../Components/Module 5 - Product Distribution and Confirmation/OrderConfirmationUI';
import { OrderTransactionDetails } from '../Components/Module 5 - Product Distribution and Confirmation/OrderTransactionDetails';
import DistributorRegistration from '../Components/Module 2 - Registrations/DistributorRegistrationUI';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ContentDealer from './ContentsDealer';
import ContentSalesAssociate from './ContentsSalesAssociate';
import ContentCashier from './ContentsCashier';
import ContentBothSalesCashier from './ContentsBothSalesCashier';
import ThankYouScreen from '../Components/A - SplashScreen/ThankYouScreen';
import { DistributorProfileDetails } from '../Components/Module 4 - Profiles & Approval/DistributorProfileDetailsUI';
import ScrollToTop from './ScrollToTop';
import Dashboard from "../Components/Module 3 - Dashboards/DashboardUI";
import DealerDashboard from "../Components/Module 3 - Dashboards/DealerDashboard";
import CashierDashboard from '../Components/Module 3 - Dashboards/CashierDashboardUI';
import SalesAndCashierDashboard from '../Components/Module 3 - Dashboards/SalesAndCashierDashboardUI';
import SalesAssociateDashboard from '../Components/Module 3 - Dashboards/SalesAssociateDashboardUI';
import AddProduct from '../Components/Module 2 - Registrations/AddProductUI';
import ProductList from '../Components/Module 4 - Profiles & Approval/ProductListUI';
import UpdateProduct from '../Components/Module 2 - Registrations/UpdateProduct';
import UpdateCustomer from '../Components/Module 4 - Profiles & Approval/UpdateCustomer';
import CustomerRegistration from '../Components/Module 5 - Product Distribution and Confirmation/CustomerRegistration';
import DealerProductList from '../Components/Module 5 - Product Distribution and Confirmation/DealerProductList';
import PaymentRecord from '../Components/Module 5 - Product Distribution and Confirmation/PaymentRecord';
import CustomerOrderForm from '../Components/Module 5 - Product Distribution and Confirmation/CustomerOrderForm';
import CustomerList from '../Components/Module 4 - Profiles & Approval/CustomerList';
import DepositList from '../Components/Module 4 - Profiles & Approval/DepositList';
import Customer from '../Components/Module 4 - Profiles & Approval/Customer';
import Deposit from "../Components/Module 8 - Payments/Deposit";
import DepositReceipt from "../Components/Module 8 - Payments/DepositReceipt";
import DistributorOrderHistory from "../Components/Module 8 - Payments/DistributorOrderHistory";
import History from "../Components/Module 8 - Payments/History";
import DepositConfirmation from "../Components/Module 8 - Payments/DepositConfirmation";
import Invoices from '../Components/Module 5 - Product Distribution and Confirmation/Invoices';
import { CustomerTransaction } from '../Components/Module 5 - Product Distribution and Confirmation/CustomerTransaction';
import { CustomerOrderTransaction } from '../Components/Module 5 - Product Distribution and Confirmation/CustomerOrderTransaction';
import CustomerCollection from '../Components/Module 6 - Collector Assignment/CustomerCollection';
import CustomerOrder from '../Components/Module 6 - Collector Assignment/CustomerOrder';
import Payment from "../Components/Module 8 - Payments/Payment";


export default function MainRoutes() {

    const user = JSON.parse(localStorage.getItem('user')!) || {};

    return (
        <Routes>
            <Route path="/" element={<SplashscreenContent />}>
                
                <Route path="/" element={<Navigate replace to="WelcomeScreen" />} />
                <Route path="/WelcomeScreen" element={<WelcomeScreen />} /> 
                
                {/* <SignupScreen/> */}
                <Route path="/" element={<SignUpContent />}>
                    <Route path="/" element={<Navigate replace to="SignUpScreen" />} />
                    <Route path="/SignUpScreen" element={<SignupScreen />} />
                    <Route path="/DealerRegistration" element={<DealerRegistration />} />
                    <Route path="/DistributorRegistration" element={<DistributorRegistration />} />
                    <Route path="/ThankYou" element={<><ScrollToTop/><ThankYouScreen /></>} />
                </Route>

                {/* <SigninScreen/> */}
                <Route path="/" element={<SignInContent />}>
                    <Route path="/" element={<Navigate replace to="SignIn" />} />
                    <Route path="/SignIn" element={<><ScrollToTop/><SignIn /></>} />

                    {user && user!.tableName === "Dealer" && (
                        <Route path="/" element={<ContentDealer/>}>
                            <Route path="/" element={<><ScrollToTop/><Navigate replace to="dealerOrderForm" /></>} />
                            <Route path="/dealerOrderForm" element={<><ScrollToTop/><DealerOrderForm /></>} />
                            <Route path="/customerOrderForm" element={<><ScrollToTop/><CustomerOrderForm /></>} />
                            <Route path="/customerRegistration" element={<CustomerRegistration />} />
                            <Route path="/dealerProduct" element={<DealerProductList />} />
                            <Route path="/paymentRecord" element={<PaymentRecord />} />
                            <Route path="/customerlist" element={<CustomerList />} />
                            <Route path="/depositlist" element={<DepositList />} />
                            <Route path="/dealerdashboard" element={<><ScrollToTop/><DealerDashboard /></>} />
                            <Route path="/deposit" element={<Deposit />} />
                            <Route path="/customercollection" element={<CustomerCollection/>} />
                            <Route path="/customerorder" element={<CustomerOrder/>} />
                            <Route path="/payment" element={<Payment/>} />
                            <Route path="/history" element={<History/>} />
                            <Route path="/update_customer/:objectId" element={<UpdateCustomer />} />
                            <Route path="/dealerProfileDetails/:objectId" element={<><ScrollToTop/><DealerProfileDetails/></>} />
                            <Route path="/orderTransactionDetails/:objectId" element={<><ScrollToTop/><OrderTransactionDetails /></>} />
                            <Route path="/customerTransaction/:objectId" element={<><ScrollToTop/><CustomerTransaction/></>} />
                            <Route path="/customerOrderTransaction/:objectId" element={<><ScrollToTop/><CustomerOrderTransaction/></>} />
                        </Route>
                    )}

                    {user && user!.tableName === "Distributor" && (
                        <Route path="/" element={<Content />}>
                            {/* Temporarily Removed Routes
                            <Route path="/schedules/:objectId" element={<><ScrollToTop/><Schedules /></>} />
                            <Route path="/collectorAssignment" element={<CollectorAssignment />} />
                            <Route path="/dealerOrderForm" element={<DealerOrderForm />} />
                            */}

                            <Route path="/" element={<Navigate replace to="dashboard" />} />
                            <Route path="/dashboard" element={<><ScrollToTop/><Dashboard /></>} />

                            {/* CRUD PRODUCTS */}
                            <Route path="/addproduct" element={<AddProduct />} />
                            <Route path="/productlist" element={<ProductList />} />
                            <Route path="/update_product/:productId" element={<UpdateProduct />} />
                            <Route path="/distributorOrderForm" element={<><ScrollToTop/><DistributorOrderForm/></>} />
                            <Route path="/orderConfirmation/:objectId" element={<><ScrollToTop/><OrderConfirmation /></>} />
                            <Route path="/productDistributionList" element={<ProductDistributionList />} />
                            <Route path="/invoices" element={<Invoices />} />
                            <Route path="/orderTransactionDetails/:objectId" element={<><ScrollToTop/><OrderTransactionDetails /></>} />
                            <Route path="/customerTransaction/:objectId" element={<><ScrollToTop/><CustomerTransaction/></>} />
                            <Route path="/customer/:objectId" element={<Customer />} />
                            <Route path="/dealerProfileList" element={<DealerProfileListUI />} />
                            <Route path="/dealerProfileDetails/:objectId" element={<><ScrollToTop/><DealerProfileDetails /></>}></Route>
                            <Route path="/dealerRegistration" element={<DealerRegistration/>} />
                            <Route path="/depositReceipt" element={<DepositReceipt />} />
                            <Route path="/depositConfirmation/:objectId" element={<DepositConfirmation />} />
                            <Route path="/dealerApproval" element={<><ScrollToTop/><DealerApproval /></>} />
                            <Route path="/orderDetails/:objectId" element={<><ScrollToTop/><OrderDetails /></>} />
                            <Route path="/distributorOrderHistory" element={<DistributorOrderHistory />} />
                            <Route path="/distributorProfileDetails/:objectId" element={<><ScrollToTop/><DistributorProfileDetails /></>}></Route>
                        </Route>
                    )}

                    {user && user!.tableName === "Sales Associate" && (
                        <Route path="/" element={<ContentSalesAssociate />}>
                            <Route path="/" element={<Navigate replace to="salesAssociateDashboard" />} />
                            <Route path="/salesAssociateDashboard" element={<><ScrollToTop/><SalesAssociateDashboard /></>} />
                            <Route path="/productDistributionList" element={<ProductDistributionList />} />
                            <Route path="/orderTransactionDetails/:objectId" element={<><ScrollToTop/><OrderTransactionDetails /></>} />
                            <Route path="/distributorOrderForm" element={<><ScrollToTop/><DistributorOrderForm /></>} />
                            <Route path="/collectorAssignment" element={<CollectorAssignment />} />
                            <Route path="/orderDetails/:objectId" element={<><ScrollToTop/><OrderDetails /></>} />
                            <Route path="/schedules/:objectId" element={<><ScrollToTop/><Schedules /></>} />
                        </Route>
                    )}

                    {user && user!.tableName === "Cashier" && (
                        <Route path="/" element={<ContentCashier />}>
                            <Route path="/" element={<Navigate replace to="cashierDashboard" />} />
                            <Route path="/cashierDashboard" element={<><ScrollToTop/><CashierDashboard /></>} />
                        </Route>
                    )}

                    {user && user!.tableName === "Sales Associate and Cashier" && (
                        <Route path="/" element={<ContentBothSalesCashier />}>
                            <Route path="/" element={<Navigate replace to="sales&cashierDashboard" />} />
                            <Route path="/sales&cashierDashboard" element={<><ScrollToTop/><SalesAndCashierDashboard/></>} />
                            <Route path="/productDistributionList" element={<ProductDistributionList />} />
                            <Route path="/orderTransactionDetails/:objectId" element={<><ScrollToTop/><OrderTransactionDetails /></>} />
                            <Route path="/distributorOrderForm" element={<><ScrollToTop/><DistributorOrderForm /></>} />
                            <Route path="/collectorAssignment" element={<CollectorAssignment />} />
                            <Route path="/orderDetails/:objectId" element={<><ScrollToTop/><OrderDetails /></>} />
                            <Route path="/schedules/:objectId" element={<><ScrollToTop/><Schedules /></>} />
                            <Route path="/orderConfirmation/:objectId" element={<><ScrollToTop/><OrderConfirmation /></>} />
                            
                        </Route>
                    )}

                </Route>
            </Route>
        </Routes>
    )
}