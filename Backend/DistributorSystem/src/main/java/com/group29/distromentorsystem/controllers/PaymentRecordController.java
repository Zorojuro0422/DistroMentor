package com.group29.distromentorsystem.controllers;

import com.group29.distromentorsystem.models.PaymentRecord;
import com.group29.distromentorsystem.services.PaymentRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/payment-records")
public class PaymentRecordController {

    @Autowired
    private PaymentRecordService paymentRecordService;

    // Get all payment records
    @GetMapping
    public List<PaymentRecord> getAllPaymentRecords() {
        return paymentRecordService.getAllPaymentRecords();
    }

    // Get a specific payment record by ID
    @GetMapping("/payment/{paymentId}")
    public ResponseEntity<PaymentRecord> getPaymentRecordById(@PathVariable("paymentId") String paymentId) {
        if (paymentId == null || paymentId.isEmpty()) {
            return ResponseEntity.badRequest().build(); // Return bad request if paymentId is invalid
        }
        return paymentRecordService.getPaymentRecordById(paymentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build()); // Return 404 if no record found
    }


    // Create a new payment record
    @PostMapping
    public PaymentRecord createPaymentRecord(@RequestBody PaymentRecord paymentRecord) {
        return paymentRecordService.createPaymentRecord(paymentRecord);
    }

    // Update a payment record
    @PutMapping("/{id}")
    public ResponseEntity<PaymentRecord> updatePaymentRecord(
            @PathVariable String id, @RequestBody PaymentRecord updatedPaymentRecord) {
        return paymentRecordService.updatePaymentRecord(id, updatedPaymentRecord)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a payment record
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentRecord(@PathVariable String id) {
        boolean isDeleted = paymentRecordService.deletePaymentRecord(id);
        return isDeleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    // Get payment records by order ID
    @GetMapping("/order/{orderid}")
    public ResponseEntity<List<PaymentRecord>> getPaymentRecordsByOrderId(@PathVariable String orderid) {
        List<PaymentRecord> paymentRecords = paymentRecordService.getPaymentRecordsByOrderId(orderid);
        if (paymentRecords.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(paymentRecords);
    }
}
