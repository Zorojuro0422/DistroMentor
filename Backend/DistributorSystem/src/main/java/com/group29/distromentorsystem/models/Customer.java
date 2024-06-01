package com.group29.distromentorsystem.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document("Customers")
public class Customer {
    @Id
    private String customerID;
    private String dealerID;
    private String customerName;
    private String customerContactNumber;
    private String customerAddress;
    private float customerSalesAmount;

    public String getCustomerID() {
        return customerID;
    }

    public void setCustomerID(String customerID) {
        this.customerID = customerID;
    }

    public String getDealerID() {
        return dealerID;
    }

    public void setDealerID(String dealerID) {
        this.dealerID = dealerID;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerContactNumber() {
        return customerContactNumber;
    }

    public void setCustomerContactNumber(String customerContactNumber) {
        this.customerContactNumber = customerContactNumber;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public float getCustomerSalesAmount() {
        return customerSalesAmount;
    }

    public void setCustomerSalesAmount(float customerSalesAmount) {
        this.customerSalesAmount = customerSalesAmount;
    }
}
