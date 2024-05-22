package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.DirectPaymentReceipt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DirectPaymentReceiptRepository extends MongoRepository<DirectPaymentReceipt, String> {
}
