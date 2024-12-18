package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.DepositRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DepositRecordRepository extends MongoRepository<DepositRecord, String> {
    List<DepositRecord> findByOrderId(String orderId);
    List<DepositRecord> findByDealerId(String dealerId);
}
