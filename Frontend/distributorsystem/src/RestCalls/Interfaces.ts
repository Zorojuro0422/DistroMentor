//Interfaces for models

export interface IDistributor{
    distributorid:string,
    firstname: string,
    middlename: string,
    lastname: string,
    emailaddress :String,
    password: String,
    birthdate: string,
    gender: string,
    currentaddress: string,
    permanentaddress: string,
    contactnumber: string,
    dealerids: string[],
    employeeids: string[],
    orderids: string[],
    paymentreceiptids: string[],
    archiveddealerids: string[],
    documentids: string[],
}


export interface IDistributorDocument {
    documentid: string;
    name: string;
    type: string;
    content: Uint8Array; // You can specify the correct data type for the 'content' property.
    distributor: IDistributor | null; // You can reference the 'IDealer' interface you've already defined.
}


export interface IDealer {
    dealerid:string,
    firstname: string,
    middlename: string,
    lastname: string,
    emailaddress :String,
    password: String,
    birthdate: string,
    gender: string,
    currentaddress: string,
    permanentaddress: string,
    contactnumber: string,
    hasbusiness: boolean,
    businessname: string,
    businessphone: string,
    businessaddress: string,
    businesstin: string,
    creditlimit: number,
    submissiondate: string,
    confirmed: boolean,
    remarks: string,
    distributor: IDistributor,
    orderids: string[], // naa ta gihapon ni dapat
    documentids: string[],
}

export interface IArchivedDealer {
    dealerid:string,
    firstname: string,
    middlename: string,
    lastname: string,
    emailaddress :String,
    password: String,
    birthdate: string,
    gender: string,
    currentaddress: string,
    permanentaddress: string,
    contactnumber: string,
    hasbusiness: boolean,
    businessname: string,
    businessphone: string,
    businessaddress: string,
    businesstin: string,
    creditlimit: number,
    submissiondate: string,
    confirmed: boolean,
    remarks: string,
    distributor: IDistributor,
    orderids: string[], // naa ta gihapon ni dapat
    documentids: string[],
    datearchived: string,
}


export interface IDealerDocument {
    documentid: string;
    name: string;
    type: string;
    content: Uint8Array; // You can specify the correct data type for the 'content' property.
    dealer: IDealer | null; // You can reference the 'IDealer' interface you've already defined.
}

export interface IEmployee{
    employeeid:string,
    firstname: string,
    middlename: string,
    lastname: string,
    emailaddress :String,
    password: String,
    birthdate: string,
    gender: string,
    currentaddress: string,
    permanentaddress: string,
    contactnumber: string,
    tinnumber: String,
    iscashier: boolean,
    issalesassociate: boolean,
    iscollector: boolean,
    submissiondate: string,
    distributor: IDistributor,
    orderids: string[],
    paymentreceiptids: string[],
    collectionpaymentids: string[],
    documentids: string[],
}

export interface IEmployeeDocument {
    documentid: string;
    name: string;
    type: string;
    content: Uint8Array; // You can specify the correct data type for the 'content' property.
    employee: IEmployee | null; // You can reference the 'IDealer' interface you've already defined.
}


export interface IOrderedProducts {
    orderedproductid: string;
    product: IProduct;
    quantity: number;
    subtotal: number;
    totalsrp: number; // Total SRP for the product
}

export interface IOrder {
    orderid: string;
    distributiondate: string;
    orderdate: string;
    penaltyrate: number;
    paymentterms: number;
    orderamount: number; // Total amount based on product prices
    amount: number;
    orderamountsrp: number; // Total amount based on SRP
    distributor: IDistributor;
    collector: IEmployee | null;
    dealer: IDealer;
    orderedproducts: IOrderedProducts[];
    paymenttransactions: IPaymentTransaction[];
    confirmed: boolean;
    status: String;
    deposit: number;
}

export interface ICustomerOrder {
  orderid: string;
  customerid: string;
  dealerid: string;
  distributiondate: string;
  orderdate: string;
  orderamount: number;
  deposit: number;
  status: string;
  isclosed?: boolean; // Optional if it exists
  customer?: {
    _id: string;
    dealerID: string;
    firstName: string;
    lastName: string;
    customerContactNumber: string;
    customerAddress: string;
    customerSalesAmount: number;
  };
  orderedproducts: {
    _class: string;
    orderedproductid?: string | null;
    quantity: number;
    subtotal: number;
    product: {
      productid: string;
      name: string;
      quantity: number;
      unit: string;
      price: number;
      expirationDate?: string | null;
      distributorid?: string | null;
      orderedproductids?: string[] | null;
    };
    orderid?: string | null;
  }[];
}

export interface IProduct {
    productid: string;
    quantity: number;
    name: string;
    price: number;
    suggestedRetailPrice: number;
    unit: string;
    expirationDate: string;
    orderedproductids: string[]
}

export interface IPaymentTransaction {
    paymenttransactionid: string;
    amountdue: number;
    startingdate: string;
    enddate: string;
    installmentnumber: number;
    paid: boolean;
    orderid: string;
    paymentreceipts: IPaymentReceipt[];
}

export interface IPaymentReceipt {
    paymentreceiptid: string,
    remarks: string,
    amountpaid: number,
    paymenttype: string,
    paymenttransactionid: string, 
    receiverID: string,
    receivername: string
}

export interface PaymentRecord {
  paymentId: string;
  amount: number;
  dueDate: string;
  orderid: string;
  status: string;
  balance: number;
}

export interface IDirectPaymentReceipt extends IPaymentReceipt{
    remarks: string,
    datepaid: string,  
    receivedamount: number,
    daterecorded: string, 
      
}

export interface ICollectionPaymentReceipt extends IPaymentReceipt{
    collectiondate: string,
    collectionamount: number,     
    confirmationdate: string,
    isconfirmed: boolean,  
}

export interface ICollectorRemittanceProof {
    collectorremittanceproofid: string;
    name: string;
    type: string;
    content: Uint8Array; // You can specify the correct data type for the 'content' property.
    collectionPaymentReceipt: ICollectionPaymentReceipt | null; // You can reference the 'IDealer' interface you've already defined.
}

export interface IDealerPaymentProof {
    dealerpaymentproofid: string;
    name: string;
    type: string;
    content: Uint8Array; // You can specify the correct data type for the 'content' property.
    collectionPaymentReceipt: ICollectionPaymentReceipt | null; // You can reference the 'IDealer' interface you've already defined.
}

export interface DealerProduct {
  dealerproductid: string;
  dealerid: string;
  productid: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  suggestedRetailPrice: number;  // Add SRP field
  expirationDate: string;  // Add expiration date field (as a string or Date)
}


export interface IDeposit {
  depositid: string; // Unique identifier for each deposit
  transactionnumber: string; // Transaction number of the deposit
  amount: number; // Amount deposited
  proofOfRemittance: string; // Path to the uploaded proof image
  isconfirm: boolean; // True if confirmed, false otherwise
  dealerid: string; // Reference to the dealer's ID
  distributorid: string; // Reference to the distributor's ID
  orderid: string;
  paymentid: string;
  submissionDate: string; // Submission date and time of the deposit
  status: string;
  dealer: IDealer | null; // Linked dealer object, if available
  distributor: IDistributor | null; // Linked distributor object, if available
  declineReason?: string;
}