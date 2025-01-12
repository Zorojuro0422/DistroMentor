package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "TotalInterest") // Specify the MongoDB collection name
public class TotalInterest {

    @Id
    private String orderId; // Primary key (MongoDB automatically treats @Id as unique)

    private double interest; // Total interest for the order

    // Default Constructor
    public TotalInterest() {
    }

    // Parameterized Constructor
    public TotalInterest(String orderId, double interest) {
        this.orderId = orderId;
        this.interest = interest;
    }

    // Getters and Setters
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
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
                "orderId='" + orderId + '\'' +
                ", interest=" + interest +
                '}';
    }
}
