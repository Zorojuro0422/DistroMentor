package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("AllProductSubtotals")
public class AllProductSubtotal {

    @Id
    private String dealerid;  // This will now act as the primary key in MongoDB
    private double totalProductSubtotal;

    // Default constructor
    public AllProductSubtotal() {}

    // Constructor with fields
    public AllProductSubtotal(String dealerid, double totalProductSubtotal) {
        this.dealerid = dealerid;
        this.totalProductSubtotal = totalProductSubtotal;
    }

    // Getters and setters
    public String getDealerid() {
        return dealerid;
    }

    public void setDealerid(String dealerid) {
        this.dealerid = dealerid;
    }

    public double getTotalProductSubtotal() {
        return totalProductSubtotal;
    }

    public void setTotalProductSubtotal(double totalProductSubtotal) {
        this.totalProductSubtotal = totalProductSubtotal;
    }
}
