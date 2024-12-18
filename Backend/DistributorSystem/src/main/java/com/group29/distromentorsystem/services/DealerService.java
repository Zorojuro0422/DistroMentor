package com.group29.distromentorsystem.services;


import com.group29.distromentorsystem.models.*;
import com.group29.distromentorsystem.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class DealerService {

    @Autowired
    DealerRepository dealerRepository;

    @Autowired
    DealerDocumentRepository dealerDocumentRepository;

    @Autowired
    DealerEmailService dealerEmailService;

    @Autowired
    DistributorRepository distributorRepository;

    @Autowired
    ArchivedDealerRepository archivedDealerRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Dealer registerDealer(Dealer dealer, List<String> documentIds, List<String> documentNames, List<String> documentTypes, List<MultipartFile> documentContents) {


        Dealer updatedDealer = dealerRepository.save(dealer);

        Distributor distributor = distributorRepository.findById(dealer.getDistributor().getDistributorid()).get();

        for (int i = 0; i < documentIds.size(); i++) {
            DealerDocument document = new DealerDocument();
            document.setDocumentid(documentIds.get(i));
            document.setName(documentNames.get(i));
            document.setType(documentTypes.get(i));
            document.setDealer(updatedDealer);
            try {
                document.setContent(documentContents.get(i).getBytes());
            } catch (IOException e) {
                // Handle the exception (e.g., log an error).
                System.err.println("Error reading file bytes for attachment: " + document.getName());
                e.printStackTrace();
                continue;
            }
            updatedDealer.getDocumentids().add(document.getDocumentid());
            dealerDocumentRepository.save(document);

        }

        updatedDealer.setDistributor(distributor);
        distributor.getDealerids().add(updatedDealer.getDealerid());
        distributorRepository.save(distributor);

        return dealerRepository.save(updatedDealer);
    }

    public List<Dealer> getAllDealers(){
        return dealerRepository.findAll();
    }




    public Dealer getDealerByID(String dealerid){
        return dealerRepository.findById(dealerid).get();
    }




    public Dealer getDealerByDistributor(String dealerid, String distributorid) {
        Distributor distributor = distributorRepository.findById(distributorid).orElse(null);

        Dealer dealer = dealerRepository.findById(dealerid).orElse(null);

            if (dealer != null) {
                for (String distributor_dealer : distributor.getDealerids()) {
                    if (distributor_dealer.equals(dealer.getDealerid())) {
                        return dealer; // Dealer found, return the dealer
                    }
                }

                // Dealer not found in the distributor's list
                return null;
            } else {
                // Dealer with the given ID not found
                return null;
            }
    }

    public List<Dealer> getAllDealersByDistributorID(String distributorid) {
        return dealerRepository.findAllByDistributor_Distributorid(distributorid);
    }

    public Dealer findByDealeridAndPassword(String dealerid, String password){
        return dealerRepository.findByDealeridAndPassword(dealerid, password);
    }

    public void updateDealerCreditLimit(String dealerId, double creditlimit) {
        Dealer optionalDealer = dealerRepository.findById(dealerId).get();
        double previousCreditLmit = optionalDealer.getCreditlimit();
        // Get the dealer's information

        String subject = "Dealer Account Status Update";
        String content =
                "Dealer Name: " + optionalDealer.getFirstname() +" "+  optionalDealer.getMiddlename() +" "+ optionalDealer.getLastname() + "\n" +
                        "Dealer ID: " + optionalDealer.getDealerid()+ "\n" +
                        "Your Credit Limit is Updated.\n" +
                        "Previous Credit Limit: "+ previousCreditLmit + "\n" +
                        "Updated Credit Limit: " + creditlimit;

        // Use the EmailService to send the email using the dealer's email address
        dealerEmailService.sendUpdatedCreditLimitEmail(optionalDealer, subject, content);

        // Save the updated "confirmed" property back to the database
        optionalDealer.setCreditlimit(creditlimit);
        dealerRepository.save(optionalDealer);

    }

    public List<Dealer> getAllUnconfirmedDealers() {
        return dealerRepository.findByIsconfirmedFalse();
    }

    public List<Dealer> getAllUnconfirmedDealersByDistributorID(String distributorid) {
        return dealerRepository.findByDistributor_DistributoridAndIsconfirmedFalse(distributorid);
    }

    public void updateDealerConfirmation(String dealerId, Double creditlimit) {
        Optional<Dealer> optionalDealer = dealerRepository.findById(dealerId);
        // Get the dealer's information
        if (optionalDealer.isPresent()) {
            Dealer existingDealer = optionalDealer.get();
            String subject = "Dealer Information";
            String content =
                    "Dealer Name: " + existingDealer.getFirstname() + " " + existingDealer.getMiddlename() + " " + existingDealer.getLastname() + "\n" +
                            "Dealer ID: " + existingDealer.getDealerid() + "\n" +
                            "Password: " + existingDealer.getPassword() + "\n" +
                            "Your Credit Limit: " + creditlimit + "\n" +
                            "Your dealer account has been confirmed. Thank you for registering.";

            // Use the EmailService to send the email using the dealer's email address
            dealerEmailService.sendConfirmEmail(existingDealer, subject, content);


            existingDealer.setIsconfirmed(true);
            existingDealer.setRemarks("Confirmed");
            existingDealer.setCreditlimit(creditlimit);
            // Save the updated "confirmed" property back to the database
            dealerRepository.save(existingDealer);
        }
        }

    public void updateDealerPending(String dealerId,  String remarks) {
        Dealer optionalDealer = dealerRepository.findById(dealerId).get();

        // Get the dealer's information

        String subject = "Dealer Account Status Update";
        String content =
                "Dealer Name: " + optionalDealer.getFirstname() +" "+  optionalDealer.getMiddlename() +" "+ optionalDealer.getLastname() + "\n" +
                        "Dealer ID: " + optionalDealer.getDealerid()+ "\n" +
                        "Your dealer account has been marked as pending.\n" +
                        "Reason for Pending: " + remarks;

        // Use the EmailService to send the email using the dealer's email address
        dealerEmailService.sendPendingEmail(optionalDealer, subject, content);


        optionalDealer.setIsconfirmed(false);
        optionalDealer.setRemarks(remarks);
        // Save the updated "confirmed" property back to the database
        dealerRepository.save(optionalDealer);
    }

    public void updateArchivedDealer(String dealerId, String remarks, LocalDate datearchived){
        Dealer optionalDealer = dealerRepository.findById(dealerId).get();
        Distributor distributor = distributorRepository.findById(optionalDealer.getDistributor().getDistributorid()).get();

        String subject = "Dealer Account Status Update";
        String content =
                "Dealer Name: " + optionalDealer.getFirstname() +" "+  optionalDealer.getMiddlename() +" "+ optionalDealer.getLastname() + "\n" +
                        "Dealer ID: " + optionalDealer.getDealerid()+ "\n" +
                        "Your dealer account has been declined.\n" +
                        "Reason for Decline: " + remarks;

        dealerEmailService.sendDeclinedEmail(optionalDealer, subject, content);

        ArchivedDealer archivedDealer = new ArchivedDealer(optionalDealer.getDealerid(), optionalDealer.getFirstname(), optionalDealer.getMiddlename(), optionalDealer.getLastname(), optionalDealer.getEmailaddress(), optionalDealer.getPassword(), optionalDealer.getBirthdate() , optionalDealer.getGender(), optionalDealer.getCurrentaddress(), optionalDealer.getPermanentaddress(), optionalDealer.getContactnumber(), optionalDealer.isHasbusiness(), optionalDealer.getBusinessname(), optionalDealer.getBusinessaddress(), optionalDealer.getBusinessphone(), optionalDealer.getBusinesstin(), optionalDealer.getCreditlimit(), optionalDealer.getSubmissiondate(), optionalDealer.getIsconfirmed(), remarks, optionalDealer.getDistributor(), optionalDealer.getOrderids(), optionalDealer.getDocumentids(), datearchived);

        archivedDealerRepository.save(archivedDealer);
        dealerRepository.delete(optionalDealer);

        distributor.getDealerids().remove(optionalDealer.getDealerid());
        distributor.getArchiveddealerids().add(archivedDealer.getDealerid());
        distributorRepository.save(distributor);
    }


    public double getTotalOrderAmountByDealerID(String dealerid) {
        Dealer dealer = dealerRepository.findById(dealerid).orElseThrow(() -> new NoSuchElementException("Dealer not found"));

        double totalOrderAmount = 0;

        for (String orderid : dealer.getOrderids()) {
            Order order = orderRepository.findById(orderid).orElseThrow(() -> new NoSuchElementException("Order not found"));
            if (order.getStatus() == Order.OrderStatus.Closed) { // Skip orders with status Closed
                continue;
            } else {
                totalOrderAmount += order.getOrderamount();
            }
        }

        return totalOrderAmount;
    }

    public void deleteDealerById(String dealerId) {
        Optional<Dealer> dealer = dealerRepository.findById(dealerId);
        if (dealer.isPresent()) {
            dealerRepository.deleteById(dealerId);
            System.out.println("Dealer with ID " + dealerId + " deleted successfully.");
        } else {
            throw new IllegalArgumentException("Dealer with ID " + dealerId + " does not exist.");
        }
    }

    public Dealer updateDealer(String dealerId, Dealer updatedDealer) {
        Dealer existingDealer = dealerRepository.findById(dealerId).orElse(null);
        if (existingDealer != null) {
            // Update fields of existing dealer with new information
            existingDealer.setFirstname(updatedDealer.getFirstname());
            existingDealer.setMiddlename(updatedDealer.getMiddlename());
            existingDealer.setLastname(updatedDealer.getLastname());
            existingDealer.setEmailaddress(updatedDealer.getEmailaddress());
            existingDealer.setPassword(updatedDealer.getPassword());
            existingDealer.setBirthdate(updatedDealer.getBirthdate());
            existingDealer.setGender(updatedDealer.getGender());
            existingDealer.setCurrentaddress(updatedDealer.getCurrentaddress());
            existingDealer.setPermanentaddress(updatedDealer.getPermanentaddress());
            existingDealer.setContactnumber(updatedDealer.getContactnumber());
            existingDealer.setHasbusiness(updatedDealer.isHasbusiness());
            existingDealer.setBusinessname(updatedDealer.getBusinessname());
            existingDealer.setBusinessaddress(updatedDealer.getBusinessaddress());
            existingDealer.setBusinessphone(updatedDealer.getBusinessphone());
            existingDealer.setBusinesstin(updatedDealer.getBusinesstin());
            existingDealer.setCreditlimit(updatedDealer.getCreditlimit());
            existingDealer.setSubmissiondate(updatedDealer.getSubmissiondate());
            existingDealer.setIsconfirmed(updatedDealer.getIsconfirmed());
            existingDealer.setRemarks(updatedDealer.getRemarks());
            existingDealer.setDistributor(updatedDealer.getDistributor());
            existingDealer.setOrderids(updatedDealer.getOrderids());
            existingDealer.setDocumentids(updatedDealer.getDocumentids());
            existingDealer.setCustomerids(updatedDealer.getCustomerids());

            // Save the updated dealer
            return dealerRepository.save(existingDealer);
        } else {
            // Handle case when dealer with given ID is not found
            throw new IllegalArgumentException("Dealer with ID " + dealerId + " not found.");
        }
    }


}



