package com.group29.distromentorsystem.services;

import com.group29.distromentorsystem.repositories.DealerPaymentProofRepository;
import com.group29.distromentorsystem.models.DealerPaymentProof;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class DealerPaymentProofService  {

    @Autowired
    DealerPaymentProofRepository dealerPaymentProofRepository;

    public Iterable<DealerPaymentProof> findAllDealerProofByCollectionPaymentReceiptId(String paymentreceiptid){
        return dealerPaymentProofRepository.findByCollectionPaymentReceipt_Paymentreceiptid(paymentreceiptid);
    }
}
