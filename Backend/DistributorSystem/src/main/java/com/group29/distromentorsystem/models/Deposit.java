package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document("Deposits")
public class Deposit {

    @Id
    private String depositid;  // Unique identifier for each deposit
    private String transactionnumber;  // Unique transaction number for the deposit
    private double amount;  // Amount of the deposit
    private String proofOfRemittance;  // Path to the uploaded proof image
    private String dealerid;  // Reference to the dealer who made the deposit
    private String distributorid;  // Reference to the distributor overseeing the dealer
    private String orderid;  // Reference to the associated order
    private String paymentid;  // Reference to the associated payment record
    private LocalDateTime submissionDate;  // Submission date and time
    private String status;  // "unconfirmed", "confirmed", or "declined"
    private String declineReason;  // Reason for declined deposits

    public Deposit() {
        this.depositid = UUID.randomUUID().toString().substring(0, 8);
    }

    // Getters and Setters
    public String getDepositid() { return depositid; }
    public void setDepositid(String depositid) { this.depositid = depositid; }

    public String getTransactionnumber() { return transactionnumber; }
    public void setTransactionnumber(String transactionnumber) { this.transactionnumber = transactionnumber; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getProofOfRemittance() { return proofOfRemittance; }
    public void setProofOfRemittance(String proofOfRemittance) { this.proofOfRemittance = proofOfRemittance; }

    public String getDealerid() { return dealerid; }
    public void setDealerid(String dealerid) { this.dealerid = dealerid; }

    public String getDistributorid() { return distributorid; }
    public void setDistributorid(String distributorid) { this.distributorid = distributorid; }

    public String getOrderid() { return orderid; }
    public void setOrderid(String orderid) { this.orderid = orderid; }

    public String getPaymentid() { return paymentid; }
    public void setPaymentid(String paymentid) { this.paymentid = paymentid; }

    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDeclineReason() { return declineReason; }
    public void setDeclineReason(String declineReason) { this.declineReason = declineReason; }
}
