package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document("Deposits")
public class Deposit {

    @Id
    private String depositid;  // Unique identifier for each deposit
    private String transactionnumber;  // Unique transaction number for the deposit
    private double amount;  // Amount of the deposit
    private String proofOfRemittance;  // Path to the uploaded proof image
    private String status;  // Status of the deposit (pending, accepted, declined)
    private String dealerid;  // Reference to the dealer who made the deposit
    private String distributorid;  // Reference to the distributor overseeing the dealer
    private LocalDateTime submissionDate;  // Field to store the submission date and time

    // Constructors
    public Deposit() {}

    public Deposit(String transactionnumber, double amount, String proofOfRemittance, String status, String dealerid, String distributorid, LocalDateTime submissionDate) {
        this.transactionnumber = transactionnumber;
        this.amount = amount;
        this.proofOfRemittance = proofOfRemittance;
        this.status = status;
        this.dealerid = dealerid;
        this.distributorid = distributorid;
        this.submissionDate = submissionDate;
    }

    // Getters and Setters
    public String getDepositid() {
        return depositid;
    }

    public void setDepositid(String depositid) {
        this.depositid = depositid;
    }

    public String getTransactionnumber() {
        return transactionnumber;
    }

    public void setTransactionnumber(String transactionnumber) {
        this.transactionnumber = transactionnumber;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getProofOfRemittance() {
        return proofOfRemittance;
    }

    public void setProofOfRemittance(String proofOfRemittance) {
        this.proofOfRemittance = proofOfRemittance;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDealerid() {
        return dealerid;
    }

    public void setDealerid(String dealerid) {
        this.dealerid = dealerid;
    }

    public String getDistributorid() {
        return distributorid;
    }

    public void setDistributorid(String distributorid) {
        this.distributorid = distributorid;
    }

    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }
}
