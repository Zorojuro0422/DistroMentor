package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("DealerTotals")
public class DealerTotals {

    @Id
    private String dealerid;

    private double totalOrderAmount;  // Total Sales (Sum of all order amounts by the dealer)

    private double totalSRP;  // Total Suggested Retail Price (SRP) of all products

    private double profit;  // Total profit (calculated as SRP - cost)

    // Default constructor
    public DealerTotals() {
    }

    // Constructor with all fields
    public DealerTotals(String dealerid, double totalOrderAmount, double totalSRP, double profit) {
        this.dealerid = dealerid;
        this.totalOrderAmount = totalOrderAmount;
        this.totalSRP = totalSRP;
        this.profit = profit;
    }

    // Getters and Setters
    public String getDealerid() {
        return dealerid;
    }

    public void setDealerid(String dealerid) {
        this.dealerid = dealerid;
    }

    public double getTotalOrderAmount() {
        return totalOrderAmount;
    }

    public void setTotalOrderAmount(double totalOrderAmount) {
        this.totalOrderAmount = totalOrderAmount;
    }

    public double getTotalSRP() {
        return totalSRP;
    }

    public void setTotalSRP(double totalSRP) {
        this.totalSRP = totalSRP;
    }

    public double getProfit() {
        return profit;
    }

    public void setProfit(double profit) {
        this.profit = profit;
    }
}
