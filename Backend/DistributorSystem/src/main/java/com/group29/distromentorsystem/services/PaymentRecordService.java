package com.group29.distromentorsystem.services;


import com.group29.distromentorsystem.models.PaymentRecord;
import com.group29.distromentorsystem.repositories.PaymentRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentRecordService {

    @Autowired
    private PaymentRecordRepository paymentRecordRepository;

    // Get all payment records
    public List<PaymentRecord> getAllPaymentRecords() {
        return paymentRecordRepository.findAll();
    }

    // Get payment record by ID
    public Optional<PaymentRecord> getPaymentRecordById(String paymentId) {
        return paymentRecordRepository.findById(paymentId); // Find by paymentId in MongoDB
    }


    // Create a new payment record
    public PaymentRecord createPaymentRecord(PaymentRecord paymentRecord) {
        // Generate a unique paymentId using UUID and slicing it
        String generatedPaymentId = UUID.randomUUID().toString().substring(0, 8);
        paymentRecord.setPaymentId(generatedPaymentId);
        return paymentRecordRepository.save(paymentRecord);
    }

    // Update an existing payment record
    public Optional<PaymentRecord> updatePaymentRecord(String id, PaymentRecord updatedRecord) {
        return paymentRecordRepository.findById(id)
                .map(existingRecord -> {
                    existingRecord.setDueDate(updatedRecord.getDueDate());
                    existingRecord.setAmount(updatedRecord.getAmount());
                    existingRecord.setStatus(updatedRecord.getStatus());
                    return paymentRecordRepository.save(existingRecord);
                });
    }

    // Delete a payment record by ID
    public boolean deletePaymentRecord(String id) {
        if (paymentRecordRepository.existsById(id)) {
            paymentRecordRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<PaymentRecord> getPaymentRecordsByOrderId(String orderid) {
        return paymentRecordRepository.findByOrderid(orderid);
    }
}