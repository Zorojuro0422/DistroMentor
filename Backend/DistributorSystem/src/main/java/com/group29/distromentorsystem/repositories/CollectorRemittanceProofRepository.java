package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.CollectorRemittanceProof;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CollectorRemittanceProofRepository extends MongoRepository<CollectorRemittanceProof, String> {

    Iterable<CollectorRemittanceProof> findByCollectionPaymentReceipt_Paymentreceiptid(String paymentreceiptid);
}
