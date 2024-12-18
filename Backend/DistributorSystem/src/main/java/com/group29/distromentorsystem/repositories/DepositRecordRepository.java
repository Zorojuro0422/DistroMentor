package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.DepositRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DepositRecordRepository extends MongoRepository<DepositRecord, String> {
    // You can add custom queries if needed
    // For example: List<DepositRecord> findByOrderid(String orderid);
    List<DepositRecord> findByOrderid(String orderid);
    List<DepositRecord> findByDealerid(String dealerid);
}
