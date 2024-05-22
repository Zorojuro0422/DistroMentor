package com.group29.distromentorsystem.models;


import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;


public class CollectionPaymentReceipt extends PaymentReceipt {

    private LocalDate collectiondate;

    private double collectionamount;

    private String collectifyReference;

    private LocalDate confirmationdate;

    private boolean isconfirmed;

    private Set<String> collectorremittanceproofids = new HashSet<>();



    public CollectionPaymentReceipt() {
    }

    public CollectionPaymentReceipt(LocalDate collectiondate, double collectionamount, String collectifyReference, LocalDate confirmationdate, boolean isconfirmed, Set<String> collectorremittanceproofids) {
        this.collectiondate = collectiondate;
        this.collectionamount = collectionamount;
        this.collectifyReference = collectifyReference;
        this.confirmationdate = confirmationdate;
        this.isconfirmed = isconfirmed;
        this.collectorremittanceproofids = collectorremittanceproofids;
    }

    public CollectionPaymentReceipt(String paymentreceiptid, String remarks, double amountpaid, String paymenttype, String paymenttransactionid, String receiverID, String receivername, LocalDate collectiondate, double collectionamount, String collectifyReference, LocalDate confirmationdate, boolean isconfirmed, Set<String> collectorremittanceproofids) {
        super(paymentreceiptid, remarks, amountpaid, paymenttype, paymenttransactionid, receiverID, receivername);
        this.collectiondate = collectiondate;
        this.collectionamount = collectionamount;
        this.collectifyReference = collectifyReference;
        this.confirmationdate = confirmationdate;
        this.isconfirmed = isconfirmed;
        this.collectorremittanceproofids = collectorremittanceproofids;
    }


    public LocalDate getCollectiondate() {
        return collectiondate;
    }

    public void setCollectiondate(LocalDate collectiondate) {
        this.collectiondate = collectiondate;
    }

    public double getCollectionamount() {
        return collectionamount;
    }

    public void setCollectionamount(double collectionamount) {
        this.collectionamount = collectionamount;
    }


    public String getCollectifyReference() {
        return collectifyReference;
    }

    public void setCollectifyReference(String collectifyReference) {
        this.collectifyReference = collectifyReference;
    }

    public LocalDate getConfirmationdate() {
        return confirmationdate;
    }

    public void setConfirmationdate(LocalDate confirmationdate) {
        this.confirmationdate = confirmationdate;
    }

    public boolean isIsconfirmed() {
        return isconfirmed;
    }

    public void setIsconfirmed(boolean isconfirmed) {
        this.isconfirmed = isconfirmed;
    }

    public Set<String> getCollectorremittanceproofids() {
        return collectorremittanceproofids;
    }

    public void setCollectorremittanceproofids(Set<String> collectorremittanceproofids) {
        this.collectorremittanceproofids = collectorremittanceproofids;
    }


}