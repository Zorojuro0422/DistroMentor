package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.DepositRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepositRecordRepository extends MongoRepository<DepositRecord, String> {
    List<DepositRecord> findByOrderid(String orderId);
    List<DepositRecord> findByDealerid(String dealerId);
}
