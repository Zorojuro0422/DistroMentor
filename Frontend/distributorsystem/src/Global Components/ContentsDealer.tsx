import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import NewNavBarDealer from './NewNavBarDealer';
import NewAppBar from './NewAppBar';


export default function ContentDealer() {
    const location = useLocation();

    const getNavPageDealer = () => {
        const path = location.pathname;
        const navPageMapping: Record<string, string> = {
            '/dealerProfile': 'Dealer Profile',
            '/dealerOrderForm': 'Dealer Order Form',
            '/customerRegistration': 'Customer Registration Form',
        };
        const navpage = navPageMapping[path] || 'Unknown';
        return navpage;
    };
    const {objectId} =useParams();
    const getNavNamePage=()=>{
      const path=location.pathname;
      const navPageNameMapping: Record<string,string>={
          '/dealerOrderForm':'Product Distribution Form',
          '/customerRegistration': 'Customer Registration Form',
          '/dealerProduct': 'Dealer Products',
          '/customerlist': 'Customer List',
          '/customerOrderForm': 'Customer Order',
          '/dealerdashboard': 'Dashboard',
          '/customercollection': 'Customer Collection',
          '/payment': 'Orders Payment',
          [`/customerTransaction/${objectId}`] : 'Customer Order Transaction Details',
          [`/dealerProfileDetails/${objectId}`] : 'Dealer Information',
          [`/update_customer/${objectId}`] : 'Update a Customer',
          [`/employeeProfileDetails/${objectId}`] : 'Employee Information',
          [`/orderDetails/${objectId}`] : 'Order Transaction Details',
          [`/orderTransactionDetails/${objectId}`] : 'Order Transaction Details',
          [`/paymentReceiptDetails/${objectId}`] : 'Payment Receipt Details',
          [`/schedules/${objectId}`] : 'Schedule',
          '/recordDirectPayment':'Record Direct Payment',
          [`/distributorProfileDetails/${objectId}`] :'Distributor Information',
          [`/orderConfirmation/${objectId}`] : `Order Confirmation Details`,
      }
      const navpageMapped= navPageNameMapping[path]||'Unknown';
      return navpageMapped;
  }
  const getNavContentPage=()=>{
   
    const path=location.pathname;
  
    const navPageContentMapping: Record<string,string>={
        '/dealerOrderForm':'Allocate a product to generate your order.',
        '/customerRegistration':'Creating Customer of the dealer',
        '/dealerProduct':'Dealer available products',
        '/customerlist': 'Viewing of customer of the specific dealer',
        '/customerOrderForm': 'Creating an Order of the customer',
        '/dealerdashboard': 'View of dealers activity',
        '/customercollection': 'Collecting money to customer',
        '/payment': 'Paying orders to distributor',
        [`/dealerProfileDetails/${objectId}`]  : `View dealer profile details - ${objectId}`,
        [`/customerTransaction/${objectId}`]  : `View dealer profile details - ${objectId}`,
        [`/update_customer/${objectId}`]  : `Updating the customer selected - ${objectId}`,
        [`/employeeProfileDetails/${objectId}`] : `View employee profile details - ${objectId}`,
        [`/orderDetails/${objectId}`] : `View dealer's order transaction details - Order Transaction ID: ${objectId}`,
        [`/orderTransactionDetails/${objectId}`] : `View dealer's order transaction details - Order Transaction ID:  ${objectId}`,
        [`/customerTransaction/${objectId}`] : `View customer's order transaction details - Order Transaction ID:  ${objectId}`,
        [`/paymentReceiptDetails/${objectId}`] : `View payment receipt details - Receipt ID : ${objectId}`,
        [`/schedules/${objectId}`] : `Set schedule of due date/s on dealer's order transaction`,
        '/recordDirectPayment':'View, Update and Record Direct Payment from your dealer/s',
        [`/distributorProfileDetails/${objectId}`] : `View distributor profile details - ${objectId}`,
        [`/orderConfirmation/${objectId}`] : `View, update, or confirm dealer's ordered products - ${objectId}`,
    }
    const navpageMapped= navPageContentMapping[path]||'Unknown';
    return navpageMapped;
  }
  

    return (
        <div>
            <NewAppBar moduleName={getNavNamePage()} moduleContent={getNavContentPage()}/>
        
            <NewNavBarDealer moduleName={getNavPageDealer()} />
            <div style={{paddingTop:60}}>
            <Outlet />
            </div>
        </div>
    );
}