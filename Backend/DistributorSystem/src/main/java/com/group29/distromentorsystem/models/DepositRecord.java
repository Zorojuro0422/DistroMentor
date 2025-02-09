package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.UUID;
import java.time.LocalDate;

@Document("depositRecords")
public class DepositRecord {

    @Id
    private String id;  // UUID will be manually generated
    private String orderid;     // The order ID this deposit belongs to
    private String dealerid;    // The ID of the dealer making the deposit
    private LocalDate depositDate;  // The date the deposit was made
    private Double deposit;     // The amount of the deposit
    private Double remainingBalance; // The remaining balance after the deposit
    private Double penalty; // New field for the penalty amount

    // Constructor to generate a UUID as the ID when creating a new DepositRecord
    public DepositRecord() {
        this.id = UUID.randomUUID().toString().substring(0, 8); // Generate an 8-character UUID
        this.penalty = 0.0; // Default penalty to 0
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrderid() {
        return orderid;
    }

    public void setOrderid(String orderid) {
        this.orderid = orderid;
    }

    public String getDealerid() {
        return dealerid;
    }

    public void setDealerid(String dealerid) {
        this.dealerid = dealerid;
    }

    public LocalDate getDepositDate() {
        return depositDate;
    }

    public void setDepositDate(LocalDate depositDate) {
        this.depositDate = depositDate;
    }

    public Double getDeposit() {
        return deposit;
    }

    public void setDeposit(Double deposit) {
        this.deposit = deposit;
    }

    public Double getRemainingBalance() {
        return remainingBalance;
    }

    public void setRemainingBalance(Double remainingBalance) {
        this.remainingBalance = remainingBalance;
    }

    public Double getPenalty() {
        return penalty;
    }

    public void setPenalty(Double penalty) {
        this.penalty = penalty;
    }

    @Override
    public String toString() {
        return "DepositRecord{" +
                "id='" + id + '\'' +
                ", orderid='" + orderid + '\'' +
                ", dealerid='" + dealerid + '\'' +
                ", depositDate=" + depositDate +
                ", deposit=" + deposit +
                ", remainingBalance=" + remainingBalance +
                ", penalty=" + penalty +
                '}';
    }
}
