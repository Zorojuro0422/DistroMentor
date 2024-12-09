package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;

@Document("PaymentRecord")
public class PaymentRecord {

    @Id
    private String paymentId; // MongoDB uses String as IDs (ObjectId format)
    private LocalDate dueDate;
    private Double amount;

    private PaymentStatus status;

    private String orderid; // Field to reference the associated order

    public enum PaymentStatus {
        Open,
        Pending,
        Paid,
        Overdue
    }

    // Default constructor
    public PaymentRecord() {}

    // Parameterized constructor
    public PaymentRecord(LocalDate dueDate, Double amount, PaymentStatus status, String orderid) {
        this.dueDate = dueDate;
        this.amount = amount;
        this.status = status;
        this.orderid = orderid; // Set the orderid
    }

    // Getters and Setters
    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getOrderid() {
        return orderid;
    }

    public void setOrderid(String orderid) {
        this.orderid = orderid;
    }
}
