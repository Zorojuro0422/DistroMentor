package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.PaymentReceipt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentReceiptRepository extends MongoRepository<PaymentReceipt, String> {
    //di rako need ani kay sa list of receipts kay nagsagol raman tanan
    /*Iterable<DirectPaymentReceipt> getPaymentReceiptsByDiscriminatorValue(String discriminatorValue);
     */
}
