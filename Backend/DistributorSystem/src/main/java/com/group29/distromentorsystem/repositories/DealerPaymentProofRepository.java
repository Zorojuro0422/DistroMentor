package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.DealerPaymentProof;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DealerPaymentProofRepository extends MongoRepository <DealerPaymentProof, String>{

    Iterable<DealerPaymentProof> findByCollectionPaymentReceipt_Paymentreceiptid(String paymentreceiptid);
}
