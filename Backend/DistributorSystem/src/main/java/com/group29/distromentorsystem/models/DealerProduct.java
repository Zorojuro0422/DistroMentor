package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;  // Import LocalDate for expirationDate

@Document("DealerProducts")
public class DealerProduct {

    @Id
    private String dealerproductid;

    private String dealerid;

    private String productid;

    private String name;

    private int quantity;

    private String unit;

    private float price;

    private float suggestedRetailPrice;  // Suggested Retail Price

    private LocalDate expirationDate;  // New field for expiration date

    // Default constructor
    public DealerProduct() {
    }

    // Constructor with all fields
    public DealerProduct(String dealerproductid, String dealerid, String productid, String name,
                         int quantity, String unit, float price, float suggestedRetailPrice, LocalDate expirationDate) {
        this.dealerproductid = dealerproductid;
        this.dealerid = dealerid;
        this.productid = productid;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.price = price;
        this.suggestedRetailPrice = suggestedRetailPrice;
        this.expirationDate = expirationDate;  // Initialize expiration date
    }

    // Getters and Setters

    public String getDealerproductid() {
        return dealerproductid;
    }

    public void setDealerproductid(String dealerproductid) {
        this.dealerproductid = dealerproductid;
    }

    public String getDealerid() {
        return dealerid;
    }

    public void setDealerid(String dealerid) {
        this.dealerid = dealerid;
    }

    public String getProductid() {
        return productid;
    }

    public void setProductid(String productid) {
        this.productid = productid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public float getSuggestedRetailPrice() {
        return suggestedRetailPrice;
    }

    public void setSuggestedRetailPrice(float suggestedRetailPrice) {
        this.suggestedRetailPrice = suggestedRetailPrice;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }
}
