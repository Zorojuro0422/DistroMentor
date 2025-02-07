package com.group29.distromentorsystem.models;

import org.springframework.data.annotation.*;
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

    private double amount; // Added field for amount

    private Distributor distributor;

    private Dealer dealer;

    private Employee collector;

    private Set<OrderedProduct> orderedproducts;

    private boolean isconfirmed;

    private OrderStatus status;

    private double deposit;

    public Order() {
    }

    public Order(String orderid, LocalDate orderdate, LocalDate distributiondate, float penaltyrate, int paymentterms, double orderamount, double amount, Distributor distributor, Dealer dealer, Employee collector, Set<OrderedProduct> orderedproducts, boolean isconfirmed, OrderStatus status, double deposit) {
        this.orderid = orderid;
        this.orderdate = orderdate;
        this.distributiondate = distributiondate;
        this.penaltyrate = penaltyrate;
        this.paymentterms = paymentterms;
        this.orderamount = orderamount;
        this.amount = amount; // Initialize the amount
        this.distributor = distributor;
        this.dealer = dealer;
        this.collector = collector;
        this.orderedproducts = orderedproducts;
        this.isconfirmed = isconfirmed;
        this.status = status;
        this.deposit = deposit;
    }

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

    public double getAmount() { // Getter for amount
        return amount;
    }

    public void setAmount(double amount) { // Setter for amount
        this.amount = amount;
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

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public double getDeposit() {
        return deposit;
    }

    public void setDeposit(double deposit) {
        this.deposit = deposit;
    }

    // Enum for Order Status
    public enum OrderStatus {
        Open,
        Pending,
        Closed
    }
}
