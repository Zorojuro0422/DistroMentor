package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("OrderedProducts")
public class OrderedProduct {

    @Id
    private String orderedproductid;

    private int quantity;

    private double subtotal;

    private double totalsrp;  // New field for total SRP

    //@DBRef
    private Product product;

    //@DBRef
    private String orderid;

    public OrderedProduct() {
    }

    public OrderedProduct(String orderedproductid, int quantity, double subtotal, double totalsrp, Product product, String orderid) {
        this.orderedproductid = orderedproductid;
        this.quantity = quantity;
        this.subtotal = subtotal;
        this.totalsrp = totalsrp;
        this.product = product;
        this.orderid = orderid;
    }

    // Getters and Setters
    public String getOrderedproductid() {
        return orderedproductid;
    }

    public void setOrderedproductid(String orderedproductid) {
        this.orderedproductid = orderedproductid;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
        calculateTotalSRP();  // Recalculate totalsrp when quantity changes
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public double getTotalsrp() {
        return totalsrp;
    }

    public void setTotalsrp(double totalsrp) {
        this.totalsrp = totalsrp;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
        calculateTotalSRP();  // Recalculate totalsrp when product changes
    }

    public String getOrderid() {
        return orderid;
    }

    public void setOrderid(String orderid) {
        this.orderid = orderid;
    }

    // Calculate the total SRP based on product's SRP and quantity
    private void calculateTotalSRP() {
        if (this.product != null) {
            this.totalsrp = this.quantity * this.product.getSuggestedRetailPrice();
        }
    }
}
