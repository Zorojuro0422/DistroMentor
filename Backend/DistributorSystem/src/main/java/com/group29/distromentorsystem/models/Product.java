package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.util.Set;

@Document("Products")
public class Product {

    @Id
    private String productid;

    private String name;

    private int quantity;

    private String unit;

    private float price;

    private float suggestedRetailPrice;  // New field for suggested retail price

    private LocalDate expirationDate;  // New field for expiration date

    private String distributorid;  // New field for distributor ID

    private Set<String> orderedproductids;

    public Product() {
    }

    public Product(String productid, String name, int quantity, String unit, float price,
                   float suggestedRetailPrice, LocalDate expirationDate, String distributorid,
                   Set<String> orderedproductids) {
        this.productid = productid;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.price = price;
        this.suggestedRetailPrice = suggestedRetailPrice;
        this.expirationDate = expirationDate;
        this.distributorid = distributorid;
        this.orderedproductids = orderedproductids;
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

    public String getDistributorid() {
        return distributorid;
    }

    public void setDistributorid(String distributorid) {
        this.distributorid = distributorid;
    }

    public Set<String> getOrderedproductids() {
        return orderedproductids;
    }

    public void setOrderedproductids(Set<String> orderedproductids) {
        this.orderedproductids = orderedproductids;
    }
}
