package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "TotalInterest") // Specify the MongoDB collection name
public class TotalInterest {

    @Id
    private String dealerId; // Primary key (MongoDB automatically treats @Id as unique)

    private double interest; // Total interest for the dealer

    // Default Constructor
    public TotalInterest() {
    }

    // Parameterized Constructor
    public TotalInterest(String dealerId, double interest) {
        this.dealerId = dealerId;
        this.interest = interest;
    }

    // Getters and Setters
    public String getDealerId() {
        return dealerId;
    }

    public void setDealerId(String dealerId) {
        this.dealerId = dealerId;
    }

    public double getInterest() {
        return interest;
    }

    public void setInterest(double interest) {
        this.interest = interest;
    }

    @Override
    public String toString() {
        return "TotalInterest{" +
                "dealerId='" + dealerId + '\'' +
                ", interest=" + interest +
                '}';
    }
}