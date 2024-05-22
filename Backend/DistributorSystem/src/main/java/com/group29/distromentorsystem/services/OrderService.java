package com.group29.distromentorsystem.services;

import com.group29.distromentorsystem.models.*;
import com.group29.distromentorsystem.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;


@Service
public class OrderService {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderedProductService orderedProductService;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    OrderedProductRepository orderedProductRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    DealerRepository dealerRepository;

    @Autowired
    DistributorRepository distributorRepository;

    @Autowired
    PaymentTransactionService paymentTransactionService;

    public Order createOrder(Order order) {

        Order newOrder =  orderRepository.save(order);

        double orderamount = 0;


        Dealer dealer = dealerRepository.findById(order.getDealer().getDealerid()).get();


        Distributor distributor = distributorRepository.findById(dealer.getDistributor().getDistributorid()).get();

        Set<OrderedProduct> newOrderedProducts = order.getOrderedproducts();
        Set<OrderedProduct> savedOrderedProducts = new HashSet<>();

        for(OrderedProduct op :newOrderedProducts) {
            String productid = op.getProduct().getProductid();
            int quantity = op.getQuantity();


            Product product = productRepository.findById(productid).get();


            if(product != null) {
                float price = product.getPrice();
                double subtotal = price * quantity;

                OrderedProduct newOrderedProduct = new OrderedProduct(op.getOrderedproductid(), quantity, op.getSubtotal(), product, newOrder.getOrderid());

                newOrderedProduct = orderedProductRepository.save(newOrderedProduct);

                savedOrderedProducts.add(newOrderedProduct);

                orderamount += subtotal;

                newOrderedProduct.setProduct(product);
                product.getOrderedproductids().add(newOrderedProduct.getOrderedproductid());
                productRepository.save(product);
                orderedProductRepository.save(newOrderedProduct);



            }
        }
        newOrder.setOrderedproducts(savedOrderedProducts);
        newOrder.setOrderamount(orderamount);

        //connection to dealer
        //dealer.setDistributor(distributor);
        dealer.getOrderids().add(newOrder.getOrderid());
        dealerRepository.save(dealer);

        newOrder.setDistributor(distributor);
        distributor.getOrderids().add(newOrder.getOrderid());
        distributorRepository.save(distributor);

        return orderRepository.save(newOrder);
    }


    public List<Order> getAllOrders(){
        return orderRepository.findAll();

    }

    public Optional<Order> getOrderByID(String orderid){

        return orderRepository.findById(orderid);
    }

    public Order getOrderByPaymentTransactionID(String paymenttransactionid){
        PaymentTransaction paymentTransaction = paymentTransactionRepository.findById(paymenttransactionid).get();
        return orderRepository.findById(paymentTransaction.getOrderid()).get();
    }

    /*public ResponseEntity assignCollector(String orderid, Employee collector) {
        Order order = orderRepository.findById(orderid).get();
        Employee employee = employeeRepository.findById(collector.getEmployeeid()).get();

        if (order.getCollector() == null) {
            order.setCollector(employee);
        }else{
            Employee prevEmployee = order.getCollector();
            prevEmployee.getOrders().remove(order);
            employeeRepository.save(prevEmployee);
            order.setCollector(employee);
        }


        employee.getOrders().add(order);

        orderRepository.save(order);
        employeeRepository.save(employee);

        return new ResponseEntity("Collector assigned successfully", HttpStatus.OK);
    }
*/

    public List<Order> getAllOrdersByDistributorID(String distributorid) {
        return orderRepository.findAllByDistributor_Distributorid(distributorid);
    }

    public ResponseEntity assignCollector(String[] orderids, String collectorid) {
        Employee employee = employeeRepository.findById(collectorid).get();


        for (String orderId : orderids) {
            Order order = orderRepository.findById(orderId).get();

            if (order != null) {
                if (order.getCollector() != null) {
                    Employee prevEmployee = order.getCollector();
                    prevEmployee.getOrderids().remove(order.getOrderid());
                    employeeRepository.save(prevEmployee);
                }


                order.setCollector(employee);
                orderRepository.save(order);


                employee.getOrderids().add(order.getOrderid());
            }
        }

        employeeRepository.save(employee);
        return new ResponseEntity("Collector assigned successfully", HttpStatus.OK);
    }

    public ResponseEntity removeCollector(String orderid) {

        Order order = orderRepository.findById(orderid).get();


        Employee employee = employeeRepository.findById(order.getCollector().getEmployeeid()).get();
        employee.getOrderids().remove(orderid);
        employeeRepository.save(employee);

        order.setCollector(null);
        orderRepository.save(order);

        return new ResponseEntity("Collector removed successfully", HttpStatus.OK);
    }
    public ResponseEntity updateOrder(String orderId, Order updatedOrder) {
        Order optionalOrder = orderRepository.findById(orderId).get();

        if (optionalOrder != null) {

            // Update order details from the updatedOrder object
            optionalOrder.setPenaltyrate(updatedOrder.getPenaltyrate());
            optionalOrder.setDistributiondate(updatedOrder.getDistributiondate());
            optionalOrder.setPaymentterms(updatedOrder.getPaymentterms());
            optionalOrder.setOrderedproducts(updatedOrder.getOrderedproducts());
            optionalOrder.setOrderamount(updatedOrder.getOrderamount());
            optionalOrder.setConfirmed(updatedOrder.getConfirmed());
            optionalOrder.setIsclosed(updatedOrder.isIsclosed());
            for (OrderedProduct op: updatedOrder.getOrderedproducts()){
                op.setOrderid(updatedOrder.getOrderid());
            }

            // You can add more fields to update as needed

            // Save the updated order to the repository
            orderRepository.save(optionalOrder);


            return new ResponseEntity<>("Order updated successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Order not found", HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity updateOrderClosedStatus(String orderId) {
        Order order = orderRepository.findById(orderId).get();

        boolean allPaymentsPaid = true;

        List<PaymentTransaction> paymentTransactionsFromOrder = paymentTransactionService.getAllPaymentTransactionsByOrderID(order.getOrderid(), order.getDistributor().getDistributorid());

        for (PaymentTransaction transaction : paymentTransactionsFromOrder) {
            if (!transaction.isPaid()) {
                allPaymentsPaid = false;
                break; // Exit the loop as soon as you find an unpaid transaction
            }
        }

        order.setIsclosed(allPaymentsPaid);
        orderRepository.save(order);
        return new ResponseEntity<>("Order closed status updated successfully", HttpStatus.OK);
    }

  /*  @Scheduled(cron = "0 0 0 * * *") // Run every day at midnight
    public void applyPenaltyForLatePayments(String orderId) {
        LocalDate currentDate = LocalDate.of(2023, Month.NOVEMBER, 30);

        // Find the specific order
        Order order = orderRepository.findById(orderId).orElse(null);

        if (order != null) {
            Set<PaymentTransaction> paymentTransactions = order.getPaymenttransactions();

            for (PaymentTransaction paymentTransaction : paymentTransactions) {
                LocalDate endDate = paymentTransaction.getEnddate();

                if (!paymentTransaction.isPaid() && currentDate.isAfter(endDate)) {
                    double penaltyRate = order.getPenaltyrate();

                    // Calculate the penalty and update the payment transaction
                    double penaltyAmount = (paymentTransaction.getAmountdue() * penaltyRate) / 100;
                    double newAmountDue = paymentTransaction.getAmountdue() + penaltyAmount;

                    paymentTransaction.setAmountdue(newAmountDue);
                    paymentTransactionRepository.save(paymentTransaction);
                }
            }
            order.setPaymenttransactions(paymentTransactions);
            orderRepository.save(order);
        }
    }*/

    @Scheduled(cron = "0 0 0 */15 * ?")
    public void applyPenaltyForAllLatePayments() {
        LocalDate currentDate = LocalDate.now();

        // Iterate through all orders
        List<Order> orders = orderRepository.findAll();



        for (Order order : orders) {
            // Check if the order is not closed
            if (!order.isIsclosed()) {
                // Set<PaymentTransaction> paymentTransactions = order.getPaymenttransactions();

                List<PaymentTransaction> paymentTransactionsFromOrder = paymentTransactionService.getAllPaymentTransactionsByOrderID(order.getOrderid(), order.getDistributor().getDistributorid());


                for (PaymentTransaction paymentTransaction : paymentTransactionsFromOrder) {
                    LocalDate endDate = paymentTransaction.getEnddate();

                    if (!paymentTransaction.isPaid() && currentDate.isAfter(endDate)) {
                        double penaltyRate = order.getPenaltyrate();

                        // Calculate the penalty and update the payment transaction
                        double penaltyAmount = (paymentTransaction.getAmountdue() * penaltyRate) / 100;
                        double newAmountDue = paymentTransaction.getAmountdue() + penaltyAmount;

                        paymentTransaction.setAmountdue(newAmountDue);
                        paymentTransactionRepository.save(paymentTransaction);

                    }
                    order.getPaymenttransactions().add(paymentTransaction);
                    orderRepository.save(order);
                }
            }
        }
    }

    public List<Order> getAllUnconfirmedOrders() {

        return orderRepository.findByIsconfirmedFalse();
    }

    public List<Order> getOrderByDealerId(String dealerId){

        return orderRepository.findByDealer_Dealerid(dealerId);
    }

    public List<Order> getAllUnconfirmedOrdersByDistributorID(String distributorid) {
        return orderRepository.findByDistributor_DistributoridAndIsconfirmedFalse(distributorid);
    }



    public Order getOrderByIDUnderDistributor(String orderid, String distributorid){
        boolean exists = orderRepository.existsByOrderidAndDistributor_Distributorid(orderid, distributorid);
        if(exists) {
            return orderRepository.findById(orderid).orElse(null);
        }
        else
            return null;
    }


    public List<Order> findByCollectorIsNotNullAndPaymenttransactionsIsEmpty() {

        List<Order> completeOrders = new ArrayList<>();

        List <Order> allOrders = orderRepository.findAll();

        for(Order order : allOrders){

            if(order.getCollector() != null ){
                if(!order.getPaymenttransactions().isEmpty()){
                    completeOrders.add(order);
                }
            }
        }

        return completeOrders;

    }



    //feb 9 2024
    //test function if i can get data from deployed collectify
    //   @Scheduled(cron = "*/10 * * * * ?")
  /*  public void getAllCollectionDataFromCollectify() {

        RestTemplate restTemplate = new RestTemplate();

        ParameterizedTypeReference<List<Map<String, Object>>> responseType = new ParameterizedTypeReference<List<Map<String, Object>>>() {
        };

        //get sa tanan objects ana nga endpoint
        ResponseEntity<List<Map<String, Object>>> responseEntity = restTemplate.exchange("https://collectify-backend-sre6.onrender.com/contracts", HttpMethod.GET, null, responseType);



        for (Map<String, Object> entry : responseEntity.getBody()) {
           // System.out.println(entry.get("contract_id") + "contract_id ni dol");

            //System.out.println(entry.get("fullPrice") + "price ni dol");
            Order newOrderFromCollectify = new Order();

            newOrderFromCollectify.setOrderid(entry.get("contract_id").toString());
           newOrderFromCollectify.setOrderamount(Double.parseDouble(String.valueOf(entry.get("fullPrice"))));
           newOrderFromCollectify.setDistributiondate(LocalDate.parse(String.valueOf(entry.get("distributiondate"))));
           //if naa mga null, pwede mani butangan og condition nga mo continue lang sa next value if null

            orderRepository.save(newOrderFromCollectify);

            }
        }*/

        /*if (paymentTransactionsArray != null) {
            for (Map<String, Object> item : paymentTransactionsArray) {

                if ((boolean) item.get("paid") != false) {
                    System.out.println("paid already. payment transaction id: " + item.get("payment_transactionid"));

                    CollectionPaymentReceipt newCPR = new CollectionPaymentReceipt();

                    newCPR.setPaymentreceiptid(item.get("payment_transactionid").toString());
                    newCPR.setPaymenttype("collection");

                    newCPR.setCollectiondate(LocalDate.parse((String) item.get("enddate")));
                    newCPR.setCollectionamount((double) item.get("amountdue"));
                    newCPR.setRemitteddate(LocalDate.parse((String) item.get("enddate")));
                    newCPR.setRemittedamount((double) item.get("amountdue"));



                    Map<String, Object> details = (Map<String, Object>) item.get("transactionProof");

                    List<String> collectorproofid = new ArrayList<>(Arrays.asList((String) details.get("id")));
                    List<String> collectordocumentNames = new ArrayList<>(Arrays.asList((String) details.get("name")));
                    List<String> collectordocumentTypes = new ArrayList<>(Arrays.asList((String) details.get("type")));
                    List<MultipartFile> collectordocumentContents = new ArrayList<>();


                    byte[] decodedBytes = Base64.getDecoder().decode((String) details.get("data"));

                    MockMultipartFile multipartFile = new MockMultipartFile(
                            "file",            // parameter name
                            "filename.txt",    // original filename
                            "image/png",      // content type
                            decodedBytes        // content as byte array
                    );

                    collectordocumentContents.add(multipartFile);

                    createCollectionPaymentReceipt(
                            newCPR,
                            collectorproofid, collectorproofid,
                            collectordocumentNames, collectordocumentNames,
                            collectordocumentTypes, collectordocumentTypes,
                            collectordocumentContents, collectordocumentContents
                    );

                    System.out.println("bast mo print ni, na trigger ang function sa pag himo og proof huehue");
                } else {
                    System.out.println("not paid yet. payment transaction id:" + item.get("payment_transactionid"));
                }
                // String paytid = (String) item.get("payment_transactionid");
                //  PaymentTransaction ptfromDistriLinkDB = paymentTransactionRepository.findById(paytid).get();


            }


            //maghimo ko payment transaction nga objects? ako
            // tagsa- tagsaon ang sa ila kay di man ko kakuah directly
            // nope dili gihapon

        *//*if(collectors != null){
            for(Employee collectifyCollector : collectors){

                CollectionPaymentReceipt collectionPaymentReceipt = new CollectionPaymentReceipt();

                Set<String> collectifyCollectorPR = collectifyCollector.getPaymentreceiptids();

                List<PaymentReceipt> currentcollectorpaymentReceipt = paymentReceiptRepository.findAllById(collectifyCollectorPR);

                for(PaymentReceipt pr : currentcollectorpaymentReceipt ){
                    if(pr.)
                }

            }
        }*//*


        }*/



    //feb 9 2024
    //test function if i can get data from deployed collectify
 //   @Scheduled(cron = "*/10 * * * * ?")
  /*  public void getAllCollectionDataFromCollectify() {

        RestTemplate restTemplate = new RestTemplate();

        ParameterizedTypeReference<List<Map<String, Object>>> responseType = new ParameterizedTypeReference<List<Map<String, Object>>>() {
        };

        //get sa tanan objects ana nga endpoint
        ResponseEntity<List<Map<String, Object>>> responseEntity = restTemplate.exchange("https://collectify-backend-sre6.onrender.com/contracts", HttpMethod.GET, null, responseType);



        for (Map<String, Object> entry : responseEntity.getBody()) {
           // System.out.println(entry.get("contract_id") + "contract_id ni dol");

            //System.out.println(entry.get("fullPrice") + "price ni dol");
            Order newOrderFromCollectify = new Order();

            newOrderFromCollectify.setOrderid(entry.get("contract_id").toString());
           newOrderFromCollectify.setOrderamount(Double.parseDouble(String.valueOf(entry.get("fullPrice"))));
           newOrderFromCollectify.setDistributiondate(LocalDate.parse(String.valueOf(entry.get("distributiondate"))));
           //if naa mga null, pwede mani butangan og condition nga mo continue lang sa next value if null

            orderRepository.save(newOrderFromCollectify);

            }
        }*/

        /*if (paymentTransactionsArray != null) {
            for (Map<String, Object> item : paymentTransactionsArray) {

                if ((boolean) item.get("paid") != false) {
                    System.out.println("paid already. payment transaction id: " + item.get("payment_transactionid"));

                    CollectionPaymentReceipt newCPR = new CollectionPaymentReceipt();

                    newCPR.setPaymentreceiptid(item.get("payment_transactionid").toString());
                    newCPR.setPaymenttype("collection");

                    newCPR.setCollectiondate(LocalDate.parse((String) item.get("enddate")));
                    newCPR.setCollectionamount((double) item.get("amountdue"));
                    newCPR.setRemitteddate(LocalDate.parse((String) item.get("enddate")));
                    newCPR.setRemittedamount((double) item.get("amountdue"));



                    Map<String, Object> details = (Map<String, Object>) item.get("transactionProof");

                    List<String> collectorproofid = new ArrayList<>(Arrays.asList((String) details.get("id")));
                    List<String> collectordocumentNames = new ArrayList<>(Arrays.asList((String) details.get("name")));
                    List<String> collectordocumentTypes = new ArrayList<>(Arrays.asList((String) details.get("type")));
                    List<MultipartFile> collectordocumentContents = new ArrayList<>();


                    byte[] decodedBytes = Base64.getDecoder().decode((String) details.get("data"));

                    MockMultipartFile multipartFile = new MockMultipartFile(
                            "file",            // parameter name
                            "filename.txt",    // original filename
                            "image/png",      // content type
                            decodedBytes        // content as byte array
                    );

                    collectordocumentContents.add(multipartFile);

                    createCollectionPaymentReceipt(
                            newCPR,
                            collectorproofid, collectorproofid,
                            collectordocumentNames, collectordocumentNames,
                            collectordocumentTypes, collectordocumentTypes,
                            collectordocumentContents, collectordocumentContents
                    );

                    System.out.println("bast mo print ni, na trigger ang function sa pag himo og proof huehue");
                } else {
                    System.out.println("not paid yet. payment transaction id:" + item.get("payment_transactionid"));
                }
                // String paytid = (String) item.get("payment_transactionid");
                //  PaymentTransaction ptfromDistriLinkDB = paymentTransactionRepository.findById(paytid).get();


            }


            //maghimo ko payment transaction nga objects? ako
            // tagsa- tagsaon ang sa ila kay di man ko kakuah directly
            // nope dili gihapon

        *//*if(collectors != null){
            for(Employee collectifyCollector : collectors){

                CollectionPaymentReceipt collectionPaymentReceipt = new CollectionPaymentReceipt();

                Set<String> collectifyCollectorPR = collectifyCollector.getPaymentreceiptids();

                List<PaymentReceipt> currentcollectorpaymentReceipt = paymentReceiptRepository.findAllById(collectifyCollectorPR);

                for(PaymentReceipt pr : currentcollectorpaymentReceipt ){
                    if(pr.)
                }

            }
        }*//*


        }*/




}

