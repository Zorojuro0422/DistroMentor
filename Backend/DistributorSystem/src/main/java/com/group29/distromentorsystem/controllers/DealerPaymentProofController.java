package com.group29.distromentorsystem.controllers;


import com.group29.distromentorsystem.services.DealerPaymentProofService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/dealerpaymentproof")
public class DealerPaymentProofController {

    @Autowired
    DealerPaymentProofService dealerPaymentProofService;

    @GetMapping("/findAllDealerProofByCollectionPaymentReceiptId/{paymentreceiptid}")
    public ResponseEntity<Object> findAllDealerProofByCollectionPaymentReceiptId(@PathVariable String paymentreceiptid){
        return new ResponseEntity<>(dealerPaymentProofService.findAllDealerProofByCollectionPaymentReceiptId(paymentreceiptid), HttpStatus.OK);
    }

}
