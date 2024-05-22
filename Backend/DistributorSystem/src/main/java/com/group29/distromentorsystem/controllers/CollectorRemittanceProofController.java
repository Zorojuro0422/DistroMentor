package com.group29.distromentorsystem.controllers;


import com.group29.distromentorsystem.services.CollectorRemittanceProofService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/collectorremittanceproof")
public class CollectorRemittanceProofController {


    @Autowired
    CollectorRemittanceProofService collectorRemittanceProofService;

    @GetMapping("/findAllCollectorProofByCollectionPaymentReceiptId/{paymentreceiptid}")
    public ResponseEntity<Object> findAllCollectorProofByCollectionPaymentReceiptId(@PathVariable String paymentreceiptid){
        return new ResponseEntity<>(collectorRemittanceProofService.findAllCollectorProofByCollectionPaymentReceiptId(paymentreceiptid), HttpStatus.OK);
    }

}
