package com.group29.distromentorsystem.controllers;

import com.group29.distromentorsystem.models.DepositRecord;
import com.group29.distromentorsystem.services.DepositRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/records")
public class DepositRecordController {
    private final DepositRecordService depositRecordService;

    @Autowired
    public DepositRecordController(DepositRecordService depositRecordService) {
        this.depositRecordService = depositRecordService;
    }

    // Health Check Endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Deposit API is running!");
    }

    // Endpoint to create a new deposit record
    @PostMapping("/create")
    public ResponseEntity<DepositRecord> saveDepositRecord(@RequestBody DepositRecord depositRecord) {
        try {
            DepositRecord savedRecord = depositRecordService.saveDepositRecord(depositRecord);
            return ResponseEntity.ok(savedRecord);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Endpoint to retrieve all deposit records
    @GetMapping("/all")
    public ResponseEntity<List<DepositRecord>> getAllDepositRecords() {
        List<DepositRecord> records = depositRecordService.getAllDepositRecords();
        return ResponseEntity.ok(records);
    }

    // Endpoint to retrieve deposit records by order ID
    @GetMapping("/order/{orderid}")
    public ResponseEntity<List<DepositRecord>> getDepositRecordsByOrderId(@PathVariable String orderid) {
        List<DepositRecord> records = depositRecordService.getDepositRecordsByOrderId(orderid);
        if (records.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(records);
    }

    // Endpoint to retrieve deposit records by dealer ID
    @GetMapping("/dealer/{dealerid}")
    public ResponseEntity<List<DepositRecord>> getDepositRecordsByDealer(@PathVariable String dealerid) {
        List<DepositRecord> records = depositRecordService.getDepositRecordsByDealer(dealerid);
        if (records.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(records);
    }

}
