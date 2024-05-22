package com.group29.distromentorsystem.services;


import com.group29.distromentorsystem.models.CollectorRemittanceProof;
import com.group29.distromentorsystem.repositories.CollectorRemittanceProofRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CollectorRemittanceProofService {

    @Autowired
    CollectorRemittanceProofRepository collectorRemittanceProofRepository;

    public Iterable<CollectorRemittanceProof> findAllCollectorProofByCollectionPaymentReceiptId(String paymentreceiptid){
        return collectorRemittanceProofRepository.findByCollectionPaymentReceipt_Paymentreceiptid(paymentreceiptid);
    }
}
