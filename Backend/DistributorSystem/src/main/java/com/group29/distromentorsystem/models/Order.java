package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.util.Set;

@Document("Orders")
public class Order {

    @Id
    private String orderid;

    private LocalDate orderdate;

    private LocalDate distributiondate;

    private float penaltyrate;

    private int paymentterms;

    private double orderamount;

    private double orderamountsrp;  // New field for total SRP amount

    private Distributor distributor;

    private Dealer dealer;

    private Employee collector;

    private Set<OrderedProduct> orderedproducts;

    private boolean isconfirmed;

    private boolean isclosed;

    // Default constructor
    public Order() {
    }

    // Constructor with all fields
    public Order(String orderid, LocalDate orderdate, LocalDate distributiondate, float penaltyrate,
                 int paymentterms, double orderamount, double orderamountsrp, Distributor distributor,
                 Dealer dealer, Employee collector, Set<OrderedProduct> orderedproducts,
                 boolean isconfirmed, boolean isclosed) {
        this.orderid = orderid;
        this.orderdate = orderdate;
        this.distributiondate = distributiondate;
        this.penaltyrate = penaltyrate;
        this.paymentterms = paymentterms;
        this.orderamount = orderamount;
        this.orderamountsrp = orderamountsrp;  // Initialize orderamountsrp
        this.distributor = distributor;
        this.dealer = dealer;
        this.collector = collector;
        this.orderedproducts = orderedproducts;
        this.isconfirmed = isconfirmed;
        this.isclosed = isclosed;
    }

    // Getters and Setters
    public String getOrderid() {
        return orderid;
    }

    public void setOrderid(String orderid) {
        this.orderid = orderid;
    }

    public LocalDate getOrderdate() {
        return orderdate;
    }

    public void setOrderdate(LocalDate orderdate) {
        this.orderdate = orderdate;
    }

    public LocalDate getDistributiondate() {
        return distributiondate;
    }

    public void setDistributiondate(LocalDate distributiondate) {
        this.distributiondate = distributiondate;
    }

    public float getPenaltyrate() {
        return penaltyrate;
    }

    public void setPenaltyrate(float penaltyrate) {
        this.penaltyrate = penaltyrate;
    }

    public int getPaymentterms() {
        return paymentterms;
    }

    public void setPaymentterms(int paymentterms) {
        this.paymentterms = paymentterms;
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

    public Distributor getDistributor() {
        return distributor;
    }

    public void setDistributor(Distributor distributor) {
        this.distributor = distributor;
    }

    public Dealer getDealer() {
        return dealer;
    }

    public void setDealer(Dealer dealer) {
        this.dealer = dealer;
    }

    public Employee getCollector() {
        return collector;
    }

    public void setCollector(Employee collector) {
        this.collector = collector;
    }

    public Set<OrderedProduct> getOrderedproducts() {
        return orderedproducts;
    }

    public void setOrderedproducts(Set<OrderedProduct> orderedproducts) {
        this.orderedproducts = orderedproducts;
    }

    public boolean getConfirmed() {
        return isconfirmed;
    }

    public void setConfirmed(boolean confirmed) {
        isconfirmed = confirmed;
    }

    public boolean isIsclosed() {
        return isclosed;
    }

    public void setIsclosed(boolean isclosed) {
        this.isclosed = isclosed;
    }
}
