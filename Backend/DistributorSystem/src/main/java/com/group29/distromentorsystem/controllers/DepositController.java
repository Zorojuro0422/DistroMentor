package com.group29.distromentorsystem.controllers;

import com.group29.distromentorsystem.models.Deposit;
import com.group29.distromentorsystem.services.DepositService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/deposits")
public class DepositController {

    @Value("${file.upload-dir}")  // Defined in application.properties
    private String uploadDir;

    @Autowired
    private DepositService depositService;

    // Create a new deposit

    @PostMapping("/create")
    public ResponseEntity<Deposit> createDeposit(
            @RequestParam("dealerId") String dealerId,
            @RequestParam("distributorId") String distributorId,
            @RequestParam("amount") double amount,
            @RequestParam("transactionNumber") String transactionNumber,
            @RequestParam("paymentDate") String paymentDate,
            @RequestParam("status") String status,
            @RequestParam("proofOfRemittance") MultipartFile proofOfRemittance // File to be uploaded
    ) throws IOException {
        // Ensure the directory exists
        File directory = new File("C:/Uploads");
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Save the file to the specified directory
        File file = new File(directory.getAbsolutePath() + "/" + proofOfRemittance.getOriginalFilename());
        proofOfRemittance.transferTo(file);

        // Create and save deposit
        Deposit deposit = new Deposit();
        deposit.setDealerid(dealerId);
        deposit.setDistributorid(distributorId);
        deposit.setAmount(amount);
        deposit.setTransactionnumber(transactionNumber);
        deposit.setSubmissionDate(LocalDateTime.parse(paymentDate));
        deposit.setStatus(status);
        deposit.setProofOfRemittance("/Uploads/" + proofOfRemittance.getOriginalFilename());

        Deposit savedDeposit = depositService.createDeposit(deposit);

        return new ResponseEntity<>(savedDeposit, HttpStatus.CREATED);
    }

    // Get a deposit by its ID
    @GetMapping("/{depositId}")
    public ResponseEntity<Optional<Deposit>> getDepositById(@PathVariable String depositId) {
        Optional<Deposit> deposit = depositService.getDepositById(depositId);
        return deposit.isPresent() ? new ResponseEntity<>(deposit, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Get all deposits for a specific dealer
    @GetMapping("/dealer/{dealerId}")
    public ResponseEntity<List<Deposit>> getDepositsByDealerId(@PathVariable String dealerId) {
        List<Deposit> deposits = depositService.getDepositsByDealerId(dealerId);
        return new ResponseEntity<>(deposits, HttpStatus.OK);
    }

    // Get all deposits for a specific distributor
    @GetMapping("/distributor/{distributorId}")
    public ResponseEntity<List<Deposit>> getDepositsByDistributorId(@PathVariable String distributorId) {
        List<Deposit> deposits = depositService.getDepositsByDistributorId(distributorId);
        return new ResponseEntity<>(deposits, HttpStatus.OK);
    }

    // Get deposits by status (e.g., pending, accepted, declined)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Deposit>> getDepositsByStatus(@PathVariable String status) {
        List<Deposit> deposits = depositService.getDepositsByStatus(status);
        return new ResponseEntity<>(deposits, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Deposit>> getAllDeposits() {
        List<Deposit> deposits = depositService.getAllDeposits();
        return new ResponseEntity<>(deposits, HttpStatus.OK);
    }
}
