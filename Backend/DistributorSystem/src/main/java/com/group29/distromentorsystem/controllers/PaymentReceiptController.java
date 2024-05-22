package com.group29.distromentorsystem.controllers;


import com.group29.distromentorsystem.models.CollectionPaymentReceipt;
import com.group29.distromentorsystem.models.DirectPaymentReceipt;
import com.group29.distromentorsystem.repositories.PaymentReceiptRepository;
import com.group29.distromentorsystem.services.CollectionPaymentReceiptService;
import com.group29.distromentorsystem.services.DirectPaymentReceiptService;
import com.group29.distromentorsystem.services.PaymentReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/paymentreceipt")
public class PaymentReceiptController {

    @Autowired
    PaymentReceiptRepository paymentReceiptRepository;

    @Autowired
    PaymentReceiptService paymentReceiptService;

    @Autowired
    DirectPaymentReceiptService directPaymentReceiptService;

    @Autowired
    CollectionPaymentReceiptService collectionPaymentReceiptService;

    @GetMapping("/getAllPaymentReceipts")
    public ResponseEntity<Object> getAllPaymentReceipts() {
        return new ResponseEntity<>(paymentReceiptService.getAllPaymentReceipts(), HttpStatus.OK);
    }

    @GetMapping("/getPaymentReceiptByID/{paymentreceiptid}")
    public ResponseEntity<Object> getPaymentReceiptByID(@PathVariable String paymentreceiptid) {
        return new ResponseEntity<>(paymentReceiptService.getPaymentReceiptByID(paymentreceiptid), HttpStatus.OK);
    }

    @GetMapping("/getAllPaymentReceiptsByDistributorID/{distributorid}")
    public ResponseEntity<Object> getAllPaymentReceiptsByDistributorID(@PathVariable String distributorid) {
        return new ResponseEntity<>(paymentReceiptService.getAllPaymentReceiptsByDistributorID(distributorid), HttpStatus.OK);
    }


    @PostMapping("directpaymentreceipt/createDirectPaymentReceipt/{receiverid}")
    public ResponseEntity<Object> createDirectPaymentReceipt(@RequestBody DirectPaymentReceipt directPaymentReceipt, @PathVariable String receiverid) {
        directPaymentReceiptService.createDirectPaymentReceipt(directPaymentReceipt, receiverid);
        return new ResponseEntity<>("Direct Payment Receipt created successfully!", HttpStatus.CREATED);

    }


    @GetMapping("directpaymentreceipt/getAllDirectPaymentReceipts")
    public ResponseEntity<Object> getAllDirectPaymentReceipts() {
        return new ResponseEntity<>(directPaymentReceiptService.getAllDirectPaymentReceipts(), HttpStatus.OK);
    }

    @PostMapping("collectionpaymentreceipt/createCollectionPaymentReceipt")
    public ResponseEntity<Object> createCollectionPaymentReceipt(
            @ModelAttribute CollectionPaymentReceipt collectionPaymentReceipt,
            @RequestParam("collectorproofid") List<String> collectorproofid,
            @RequestParam("collectordocumentNames") List<String> collectordocumentNames,
            @RequestParam("collectordocumentTypes") List<String> collectordocumentTypes,
            @RequestParam("collectordocumentContents") List<MultipartFile> collectordocumentContents
    ) {
        collectionPaymentReceiptService.createCollectionPaymentReceipt(
                collectionPaymentReceipt,
                collectorproofid,
                collectordocumentNames,
                collectordocumentTypes,
                collectordocumentContents
        );

        return new ResponseEntity<>("Collection Payment Receipt created successfully!", HttpStatus.CREATED);

    }

    @PutMapping("collectionpaymentreceipt/updateCollectionPaymentReceipt/{collectionpaymentreciptid}/{receiverid}")
    public ResponseEntity<Object> confirmCollectionPaymentReceipt(@PathVariable String collectionpaymentreciptid, @PathVariable String receiverid) {
        System.out.println("Collection payment receipt confirmed successfully.");
        return new ResponseEntity<>(collectionPaymentReceiptService.confirmCollectionPaymentReceipt(collectionpaymentreciptid, receiverid), HttpStatus.OK);
    }


    @GetMapping("collectionpaymentreceipt/getAllCollectionPaymentReceipts")
    public ResponseEntity<Object> getAllCollectionPaymentReceipts() {
        return new ResponseEntity<>(collectionPaymentReceiptService.getAllCollectionPaymentReceipts(), HttpStatus.OK);
    }

    @GetMapping("collectionpaymentreceipt/getAllUnconfirmedCollectionPaymentReceipts")
    public ResponseEntity<Object> getAllUnconfirmedCollectionPaymentReceipts() {
        return new ResponseEntity<>(collectionPaymentReceiptService.getAllUnconfirmedCollectionPaymentReceipts(), HttpStatus.OK);
    }

    @GetMapping("collectionpaymentreceipt/getAllUnconfirmedCollectionPaymentReceiptsByDistributorID/{distributorid}")
    public ResponseEntity<Object> getAllUnconfirmedCollectionPaymentReceiptsByDistributorID(@PathVariable String distributorid) {
        return new ResponseEntity<>(collectionPaymentReceiptService.getAllUnconfirmedCollectionPaymentReceiptsByDistributorID(distributorid), HttpStatus.OK);
    }

    @GetMapping("collectionpaymentreceipt/get")
    public ResponseEntity<Object> getAllUnconfirmedCollectionPaymentReceiptsByDistributorID() {
        collectionPaymentReceiptService.getAllCollectionDataFromCollectifyV2();
        return new ResponseEntity<>("success get", HttpStatus.OK);
    }

}