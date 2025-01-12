package com.group29.distromentorsystem.controllers;

import com.group29.distromentorsystem.models.DepositRecord;
import com.group29.distromentorsystem.services.DepositRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/deposit")
public class DepositRecordController {

    @Autowired
    private DepositRecordService depositRecordService;

    // Endpoint to create a new deposit record
    @PostMapping("/create")
    public DepositRecord createDepositRecord(@RequestBody DepositRecord depositRecord) {
        return depositRecordService.saveDepositRecord(depositRecord);
    }

    // Endpoint to retrieve all deposit records
    @GetMapping("/all")
    public List<DepositRecord> getAllDepositRecords() {
        return depositRecordService.getAllDepositRecords();
    }

    // Endpoint to retrieve deposit records by order ID
    @GetMapping("/order/{orderid}")
    public List<DepositRecord> getDepositRecordsByOrderId(@PathVariable String orderid) {
        return depositRecordService.getDepositRecordsByOrderId(orderid);
    }

    // Endpoint to get all deposit records by dealerid
    @GetMapping("/dealer/{dealerid}")
    public List<DepositRecord> getDepositRecordsByDealer(@PathVariable String dealerid) {
        return depositRecordService.getDepositRecordsByDealer(dealerid);
    }
}
