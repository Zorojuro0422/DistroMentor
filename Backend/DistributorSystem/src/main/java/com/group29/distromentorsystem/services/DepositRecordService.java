package com.group29.distromentorsystem.services;

import com.group29.distromentorsystem.models.DepositRecord;
import com.group29.distromentorsystem.repositories.DepositRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepositRecordService {

    private final DepositRecordRepository depositRecordRepository;

    @Autowired
    public DepositRecordService(DepositRecordRepository depositRecordRepository) {
        this.depositRecordRepository = depositRecordRepository;
    }


    // Save a new deposit record
    public DepositRecord saveDepositRecord(DepositRecord depositRecord) {
        return depositRecordRepository.save(depositRecord);
    }

    // Retrieve all deposit records
    public List<DepositRecord> getAllDepositRecords() {
        return depositRecordRepository.findAll();
    }

    // Retrieve deposit records by order ID
    public List<DepositRecord> getDepositRecordsByOrderId(String orderId) {
        return depositRecordRepository.findByOrderid(orderId);
    }

    // Retrieve deposit records by dealer ID
    public List<DepositRecord> getDepositRecordsByDealer(String dealerId) {
        return depositRecordRepository.findByDealerid(dealerId);
    }

}
