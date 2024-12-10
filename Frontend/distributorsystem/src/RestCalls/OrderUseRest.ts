import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { IEmployee, IOrder } from "./Interfaces";
import { toast } from "react-toastify";





export const useRestOrder = (): [
    (order: IOrder) => void,
    (orderid: string, distributorid: string) => void,
    (paymenttransactionid: string) => void,
    (collectorid: string, orderids: string[]) => void,
    (orderID: string) => void,
    IOrder | undefined,
    IOrder | undefined,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined,
    (orderID: string | undefined, updatedOrder: IOrder) => void,
    (orderID: string) => void,
    (orderID: string | undefined) => void,

] => {

    const [order, setOrder] = useState<IOrder | undefined>();
    const [orderFromPaymentTransaction, setOrderFromPaymentTransaction] = useState<IOrder>();
    const [isOrderFound, setIsOrderFound] = useState<boolean>(false);

    const [assignedStatus, setAssignedStatus] = useState<boolean>(true);
    const [removeStatus, setRemoveStatus] = useState<boolean>(true);


    function newOrder(order: IOrder) {
        axios.post('https://distromentor.onrender.com/order/createOrder', {
            orderid: order.orderid,
            distributiondate: order.distributiondate,
            penaltyrate: order.penaltyrate,
            paymentterms: order.paymentterms,
            orderdate: order.orderdate,
            orderamount: order.orderamount,
            orderamountsrp: order.orderamountsrp,  // Add SRP total
            orderedproducts: order.orderedproducts.map((op) => ({
                orderedproductid: op.orderedproductid,
                quantity: op.quantity,
                subtotal: op.subtotal,
                totalsrp: op.totalsrp,  // Ensure totalsrp is passed for each product
                product: {
                    productid: op.product.productid,
                    name: op.product.name,
                    unit: op.product.unit,
                    quantity: op.product.quantity,
                    price: op.product.price,
                    suggestedRetailPrice: op.product.suggestedRetailPrice,  // Ensure SRP is included
                },
            })),
            distributor: {
                distributorid: order.distributor.distributorid,
                firstname: order.distributor.firstname,
                middlename: order.distributor.middlename,
                lastname: order.distributor.lastname,
                emailaddress: order.distributor.emailaddress,
                password: order.distributor.password,
                birthdate: order.distributor.birthdate,
                gender: order.distributor.gender,
                currentaddress: order.distributor.currentaddress,
                permanentaddress: order.distributor.permanentaddress,
                contactnumber: order.distributor.contactnumber,
                dealerids: order.distributor.dealerids,
                employeeids: order.distributor.employeeids,
                orderids: order.distributor.orderids,
            },
            dealer: {
                dealerid: order.dealer.dealerid,
                firstname: order.dealer.firstname,
                middlename: order.dealer.middlename,
                lastname: order.dealer.lastname,
                emailaddress: order.dealer.emailaddress,
                password: order.dealer.password,
                birthdate: order.dealer.birthdate,
                gender: order.dealer.gender,
                currentaddress: order.dealer.currentaddress,
                permanentaddress: order.dealer.permanentaddress,
                contactnumber: order.dealer.contactnumber,
                hasbusiness: order.dealer.hasbusiness,
                businessname: order.dealer.businessname,
                businessphone: order.dealer.businessphone,
                businessaddress: order.dealer.businessaddress,
                businesstin: order.dealer.businesstin,
                creditlimit: order.dealer.creditlimit,
                submissiondate: order.dealer.submissiondate,
            },
            collector: null,
            paymenttransactionids: [],
            confirmed: order.confirmed,
            status: 'Open',
        })
        .then((response) => {
            console.log("Order created successfully!", response.data);
        })
        .catch((error) => {
            console.error("Error creating a new order:", error);
        });
    }


    function updateOrder(orderID: string | undefined, updatedOrder: IOrder) {
        updatedOrder.orderedproducts.map((op) => {
            
        })
        axios.put(`http://distromentor.onrender.com/order/updateOrder/${orderID}`, updatedOrder)
            .then((response) => {

              
            })
            .catch((error) => {

               
            });
    }


    function getOrderByID(orderid: string, distributorid: string) {

        axios.get(`http://distromentor.onrender.com/order/getOrderByIDUnderDistributor/${orderid}/${distributorid}`)
            .then((response) => {

                if (response.data !== '') {

                    setOrder(response.data)
                    setIsOrderFound(true);
                    
                }

                else {
                    setIsOrderFound(false);
                    setOrder(undefined);
                  
                }

            })
            .catch((error) => {


            });
    }

    function getOrderByPaymentTransactionID(paymenttransactionid: string) {

        axios.get(`http://distromentor.onrender.com/order/getOrderByPaymentTransactionID/${paymenttransactionid}`)
            .then((response) => {
                
                setOrderFromPaymentTransaction(response.data);

            })
            .catch((error) => {

                
            });
    }


    function assignCollector(collectorid: string, orderids: string[]) {
        axios.put(`http://distromentor.onrender.com/order/assignCollector/${collectorid}`, orderids)
            .then((response) => {
                setAssignedStatus(true);
            })
            .catch((error) => {
                setAssignedStatus(false);
            });
    }

    function removeCollector(orderID: string) {
        axios.put(`http://distromentor.onrender.com/order/removeCollector/${orderID}`)
            .then((response) => {
                setRemoveStatus(true);
            })
            .catch((error) => {
                setRemoveStatus(false);
                alert("Error removing collector. Please try again.");
            });
    }

    function closedOrder(orderID: string) {
        axios.put(`http://distromentor.onrender.com/order/updateOrderClosedStatus/${orderID}`)
            .then((response) => {

            })
            .catch((error) => {
                console.log("Error closing the order. Please try again.");
            });
    }

    function applyPenalty(orderID: string | undefined) {
        axios.put(`http://distromentor.onrender.com/order/applyPenalty/${orderID}`)
            .then((response) => {

            })
            .catch((error) => {

            });
    }


    return [newOrder, getOrderByID, getOrderByPaymentTransactionID, assignCollector, removeCollector, order, orderFromPaymentTransaction, isOrderFound, assignedStatus, removeStatus, updateOrder, closedOrder, applyPenalty];
}
