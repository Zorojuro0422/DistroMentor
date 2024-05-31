package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Document("Products")
public class Product {

    @Id
    private String productId;
    private String name;
    private String unit;
    private float price;
    private int quantity; // New field for quantity
    private Set<String> orderedProductIds;
    private String productPicture;

    public Product() {
        // Default constructor
    }

    public Product(String name, String unit, float price, int quantity, Set<String> orderedProductIds, String productPicture) {
        this.name = name;
        this.unit = unit;
        this.price = price;
        this.quantity = quantity;
        this.orderedProductIds = orderedProductIds;
        this.productPicture = productPicture;
    }

    // Getters and setters

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Set<String> getOrderedProductIds() {
        return orderedProductIds;
    }

    public void setOrderedProductIds(Set<String> orderedProductIds) {
        this.orderedProductIds = orderedProductIds;
    }

    public String getProductPicture() {
        return productPicture;
    }

    public void setProductPicture(String productPicture) {
        this.productPicture = productPicture;
    }
}
