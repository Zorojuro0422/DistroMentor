package com.group29.distromentorsystem.services;


import com.group29.distromentorsystem.models.*;
import com.group29.distromentorsystem.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@Service
public class CollectionPaymentReceiptService {

    @Autowired
    CollectionPaymentReceiptRepository collectionPaymentReceiptRepository;

    @Autowired
    PaymentTransactionService paymentTransactionService;

    @Autowired
    PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    CollectorRemittanceProofRepository collectionPaymentProofRepository;

    @Autowired
    DealerPaymentProofRepository dealerPaymentProofRepository;

    @Autowired
    DistributorRepository distributorRepository;

    @Autowired
    PaymentReceiptRepository paymentReceiptRepository;

    @Autowired
    OrderRepository orderRepository;


    public CollectionPaymentReceipt createCollectionPaymentReceipt(
            CollectionPaymentReceipt collectionPaymentReceipt,
            List<String> collectorproofid,
            List<String> collectordocumentNames,
            List<String> collectordocumentTypes,
            List<MultipartFile> collectordocumentContents
    ) {

        CollectionPaymentReceipt savedCollectionPaymentReceipt = collectionPaymentReceiptRepository.save(collectionPaymentReceipt);

        PaymentTransaction paymentTransaction = paymentTransactionRepository.findById(savedCollectionPaymentReceipt.getPaymenttransactionid()).get();

        for (int i = 0; i < collectorproofid.size(); i++) {
            CollectorRemittanceProof collectorProof = new CollectorRemittanceProof();
            collectorProof.setCollectorremittanceproofid(collectorproofid.get(i));
            collectorProof.setName(collectordocumentNames.get(i));
            collectorProof.setType(collectordocumentTypes.get(i));
            collectorProof.setCollectionPaymentReceipt(savedCollectionPaymentReceipt);

            try {
                collectorProof.setContent(collectordocumentContents.get(i).getBytes());
            } catch (IOException e) {
                // Handle the exception (e.g., log an error).
                System.err.println("Error reading file bytes for attachment: " + collectorProof.getName());
                e.printStackTrace();
                continue;
            }
            collectionPaymentProofRepository.save(collectorProof);
            savedCollectionPaymentReceipt.getCollectorremittanceproofids().add(collectorProof.getCollectorremittanceproofid());
        }


        paymentTransaction.getPaymentreceipts().add(savedCollectionPaymentReceipt);

        paymentReceiptRepository.save(savedCollectionPaymentReceipt);
        paymentTransactionRepository.save(paymentTransaction);
        paymentTransactionService.UpdatePaymentTransactionInOrder(paymentTransaction.getPaymenttransactionid());


        return collectionPaymentReceiptRepository.save(savedCollectionPaymentReceipt);
    }


    public ResponseEntity confirmCollectionPaymentReceipt(String collectionpaymentreciptid, String receiverID) {

        CollectionPaymentReceipt outdatedCollectionPaymentReceipt = collectionPaymentReceiptRepository.findById(collectionpaymentreciptid).get();

        CollectionPaymentReceipt updatedCollectionPaymentReceipt = collectionPaymentReceiptRepository.findById(collectionpaymentreciptid).get();

        PaymentTransaction paymentTransaction = paymentTransactionRepository.findById(updatedCollectionPaymentReceipt.getPaymenttransactionid()).get();

        updatedCollectionPaymentReceipt.setConfirmationdate(LocalDate.now());
        updatedCollectionPaymentReceipt.setAmountpaid(updatedCollectionPaymentReceipt.getCollectionamount());
        updatedCollectionPaymentReceipt.setPaymenttransactionid(paymentTransaction.getPaymenttransactionid());
        paymentReceiptRepository.save(updatedCollectionPaymentReceipt);

        if (receiverID != null) {
            Distributor distributor = distributorRepository.findById(receiverID).orElse(null);
            Employee employee = employeeRepository.findById(receiverID).orElse(null);

            if (distributor != null) {
                updatedCollectionPaymentReceipt.setReceiverID(distributor.getDistributorid());
                updatedCollectionPaymentReceipt.setReceivername(distributor.getFullName());
                distributor.getPaymentreceiptids().add(updatedCollectionPaymentReceipt.getPaymentreceiptid());
                distributorRepository.save(distributor);
            } else if (employee != null) {
                updatedCollectionPaymentReceipt.setReceiverID(employee.getEmployeeid());
                updatedCollectionPaymentReceipt.setReceivername(employee.getFullName());
                employee.getPaymentreceiptids().add(updatedCollectionPaymentReceipt.getPaymentreceiptid());
                employeeRepository.save(employee);
            }
            updatedCollectionPaymentReceipt.setIsconfirmed(true);
        }


        for (PaymentReceipt pr : paymentTransaction.getPaymentreceipts()) {
            if (pr.getPaymentreceiptid().equals(outdatedCollectionPaymentReceipt.getPaymentreceiptid())) {
                paymentTransaction.getPaymentreceipts().remove(pr);
            }
        }
        paymentTransaction.getPaymentreceipts().add(updatedCollectionPaymentReceipt);
        paymentTransactionRepository.save(paymentTransaction);

        //code para ma true na ang isPaid sa payment transaction if ang tanan amount sa PR kay equal na sa amount due sa PT
        PaymentTransaction updatedPaymentTransaction = paymentTransactionService.updatePaidPaymentTransaction(paymentTransaction.getPaymenttransactionid());
        paymentTransactionService.UpdatePaymentTransactionInOrder(updatedPaymentTransaction.getPaymenttransactionid());
        paymentReceiptRepository.save(updatedCollectionPaymentReceipt);
        return new ResponseEntity("Collection Payment Receipt Confirmed Successfully!", HttpStatus.OK);
    }


    public List<CollectionPaymentReceipt> getAllCollectionPaymentReceipts() {
        return collectionPaymentReceiptRepository.findAll();
    }


    public List<CollectionPaymentReceipt> getAllUnconfirmedCollectionPaymentReceipts() {
        return collectionPaymentReceiptRepository.findByIsconfirmedFalse();
    }


    public List<CollectionPaymentReceipt> getAllUnconfirmedCollectionPaymentReceiptsByDistributorID(String distributorid) {

        List<CollectionPaymentReceipt> collectionPaymentReceipts = new ArrayList<>();
        Optional<Distributor> distributorOptional = distributorRepository.findById(distributorid);

        if (distributorOptional.isPresent()) {
            Distributor distributor = distributorOptional.get();

            for (String orderId : distributor.getOrderids()) {
                Optional<Order> orderOptional = orderRepository.findById(orderId);

                if (orderOptional.isPresent()) {
                    Order order = orderOptional.get();

                    for (PaymentTransaction paymentTransaction : order.getPaymenttransactions()) {

                        for (PaymentReceipt pr : paymentTransaction.getPaymentreceipts()) {
                            if (pr instanceof CollectionPaymentReceipt) {
                                CollectionPaymentReceipt collectionPaymentReceipt = (CollectionPaymentReceipt) pr;

                                if (!collectionPaymentReceipt.isIsconfirmed()) {
                                    collectionPaymentReceipts.add(collectionPaymentReceipt);
                                }
                            }
                        }
                    }
                }
            }
        }


        return collectionPaymentReceipts;
        // return collectionPaymentReceiptRepository.findByPaymenttransactionid_Order_Distributor_DistributoridAndIsconfirmedFalse(distributorid);
    }


    //execute every 15 secs
    @Scheduled(cron = "*/15 * * * * ?")
    public void getAllCollectionDataFromCollectifyV2() {

        RestTemplate restTemplate = new RestTemplate();


        ParameterizedTypeReference<List<Map<String, Object>>> responseType = new ParameterizedTypeReference<List<Map<String, Object>>>() {
        };

        //get all payment transactions from collectify
        ResponseEntity<List<Map<String, Object>>> paymentTransactionsFromCollectify = restTemplate.exchange("https://distromentor-capstone.onrender.com/paymenttransaction/getAllPaymentTransactions", HttpMethod.GET, null, responseType);


        if (paymentTransactionsFromCollectify.getBody() != null) {
            for (Map<String, Object> item : paymentTransactionsFromCollectify.getBody()) {

                //item.get("transactionProof") != null && item.get("is_collected") == true)
                if (item.get("transactionProof") != null && item.get("collected") != null) {

                    if ((Boolean) item.get(("collected"))) {

                        PaymentTransaction paymentTransactionFromPTA = paymentTransactionRepository.findById((String.valueOf(item.get("paymenttransactionid")))).get();

                        //condition to check if the payment transaction exists in the database
                        if (paymentTransactionFromPTA != null) {

                            //Find collection payment receipt by the Collectify reference
                            CollectionPaymentReceipt existingCPR = collectionPaymentReceiptRepository.findByCollectifyReference(String.valueOf(item.get("payment_transactionid")));

                            //Create new collection payment receipt if the receipt is not yet recorded in the database
                            if (existingCPR == null) {

                                //Get order id for finding employee
                                String orderid = paymentTransactionFromPTA.getOrderid();

                                //Getting collector information for the documents
                                Employee collector = employeeRepository.findByOrderidsContaining(orderid).get();


                                CollectionPaymentReceipt newCPR = new CollectionPaymentReceipt();


                                //generate id for collection payment receipt
                                UUID uuid = UUID.randomUUID();
                                newCPR.setPaymentreceiptid(uuid.toString().substring(0, 8));

                                newCPR.setPaymenttype("Collection");

                                //Error handling to set collection date to current date if its null from collectify
                                if (item.get("collectionDate") == null) {
                                    newCPR.setCollectiondate(LocalDate.now());
                                } else {
                                    newCPR.setCollectiondate(LocalDate.parse((String) item.get("collectiondate")));
                                }

                                newCPR.setCollectionamount((double) item.get("amountdue"));


                                //Set payment transaction reference
                                newCPR.setPaymenttransactionid(paymentTransactionFromPTA.getPaymenttransactionid());

                                //Set the reference from collectify
                                newCPR.setCollectifyReference(String.valueOf(item.get("payment_transactionid")));

                                //Get the transaction proofs
                                Map<String, Object> details = (Map<String, Object>) item.get("transactionProof");

                                //setting id for documents
                                List<String> collectorproofid = new ArrayList<>(Arrays.asList((String) details.get("id").toString().substring(0, 8)));

                                //Setting the name
                                List<String> collectordocumentNames = new ArrayList<>(Arrays.asList(collector.getLastname() + "CollectionProof"));

                                //Setting the file type
                                List<String> collectordocumentTypes = new ArrayList<>(Arrays.asList((String) details.get("type")));

                                //Initializing an array list for the base64 content
                                List<MultipartFile> collectordocumentContents = new ArrayList<>();

                                //decode data
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
                                        collectorproofid,
                                        collectordocumentNames,
                                        collectordocumentTypes,
                                        collectordocumentContents
                                );

                                System.out.println("Collection Payment Receipt for Payment transaction ID #" + item.get("payment_transactionid") + " successfully created");
                            } else {
                                System.out.println("Collection Payment Receipt for Payment transaction ID #" + item.get("payment_transactionid") + " already created.");
                                continue;

                            }
                        } else {
                            System.out.println("Payment transaction ID #" + item.get("payment_transactionid") + " does not exist in the DistriLink Database.");
                        }

                        //continue/skip the payment transaction from collectify since it has a record on distrilink already


                    } else {
                        System.out.println("Payment transaction ID #" + item.get("payment_transactionid") + " is not yet collected.");
                    }
                }
            }

        }
    }
}

