package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.CollectionPaymentReceipt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionPaymentReceiptRepository extends MongoRepository<CollectionPaymentReceipt, String> {
    List<CollectionPaymentReceipt> findByIsconfirmedFalse();

    CollectionPaymentReceipt findByCollectifyReference(String collectifyReference);
}

