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

    // Save a new DepositRecord
    public DepositRecord saveDepositRecord(DepositRecord depositRecord) {
        return depositRecordRepository.save(depositRecord);
    }

    // Retrieve all DepositRecords
    public List<DepositRecord> getAllDepositRecords() {
        return depositRecordRepository.findAll();
    }

    // Retrieve DepositRecord by order ID
    public List<DepositRecord> getDepositRecordsByOrderId(String orderid) {
        return depositRecordRepository.findByOrderid(orderid);
    }

    // Service method to fetch deposit records by dealerid
    public List<DepositRecord> getDepositRecordsByDealer(String dealerid) {
        return depositRecordRepository.findByDealerid(dealerid);
    }

    // You can add other custom business logic as needed
}