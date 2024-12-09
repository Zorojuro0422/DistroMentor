package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.PaymentRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRecordRepository extends MongoRepository<PaymentRecord, String> {
    List<PaymentRecord> findByOrderid(String orderid);
    Optional<PaymentRecord> findByPaymentId(String paymentId);
}
