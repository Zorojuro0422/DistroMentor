package com.group29.distromentorsystem.models;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class CustomerOrder {
    @Id
    private String orderid;
    private String customerid;
    private String dealerid;
    private LocalDate distributiondate;
    private LocalDate orderdate;
    private double orderamount;
    private double orderamountsrp;  // New field for SRP order amount

    @ManyToOne
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    private Customer customer;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    private List<OrderedProduct> orderedproducts;

    // Getters and Setters

    public String getOrderid() {
        return orderid;
    }

    public void setOrderid(String orderid) {
        this.orderid = orderid;
    }

    public String getCustomerid() {
        return customerid;
    }

    public void setCustomerid(String customerid) {
        this.customerid = customerid;
    }

    public String getDealerid() {
        return dealerid;
    }

    public void setDealerid(String dealerid) {
        this.dealerid = dealerid;
    }

    public LocalDate getDistributiondate() {
        return distributiondate;
    }

    public void setDistributiondate(LocalDate distributiondate) {
        this.distributiondate = distributiondate;
    }

    public LocalDate getOrderdate() {
        return orderdate;
    }

    public void setOrderdate(LocalDate orderdate) {
        this.orderdate = orderdate;
    }

    public double getOrderamount() {
        return orderamount;
    }

    public void setOrderamount(double orderamount) {
        this.orderamount = orderamount;
    }

    public double getOrderamountsrp() {  // Getter for orderamountsrp
        return orderamountsrp;
    }

    public void setOrderamountsrp(double orderamountsrp) {  // Setter for orderamountsrp
        this.orderamountsrp = orderamountsrp;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public List<OrderedProduct> getOrderedproducts() {
        return orderedproducts;
    }

    public void setOrderedproducts(List<OrderedProduct> orderedproducts) {
        this.orderedproducts = orderedproducts;
    }
}
