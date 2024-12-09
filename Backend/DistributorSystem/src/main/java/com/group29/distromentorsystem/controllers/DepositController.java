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

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private DepositService depositService;

    // Create a new deposit
    // Create a new deposit
    @PostMapping("/create")
    public ResponseEntity<Deposit> createDeposit(
            @RequestParam("dealerId") String dealerId,
            @RequestParam("distributorId") String distributorId,
            @RequestParam("orderId") String orderId,  // New field for order ID
            @RequestParam("paymentId") String paymentId,  // New field for payment ID
            @RequestParam("amount") double amount,
            @RequestParam("transactionNumber") String transactionNumber,
            @RequestParam("paymentDate") String paymentDate,
            @RequestParam("proofOfRemittance") MultipartFile proofOfRemittance
    ) throws IOException {
        // Ensure the directory exists
        File directory = new File("C:/Uploads");
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Save the file to the directory
        File file = new File(directory.getAbsolutePath() + "/" + proofOfRemittance.getOriginalFilename());
        proofOfRemittance.transferTo(file);

        // Create the deposit
        Deposit deposit = new Deposit();
        deposit.setDealerid(dealerId);
        deposit.setDistributorid(distributorId);
        deposit.setOrderid(orderId);  // Set order ID
        deposit.setPaymentid(paymentId);  // Set payment ID
        deposit.setAmount(amount);
        deposit.setTransactionnumber(transactionNumber);
        deposit.setSubmissionDate(LocalDateTime.parse(paymentDate));
        deposit.setProofOfRemittance("/Uploads/" + proofOfRemittance.getOriginalFilename());
        deposit.setStatus("unconfirmed");  // Default status as unconfirmed

        Deposit savedDeposit = depositService.createDeposit(deposit);

        return new ResponseEntity<>(savedDeposit, HttpStatus.CREATED);
    }

    // Get a deposit by its ID
    @GetMapping("/{depositId}")
    public ResponseEntity<Optional<Deposit>> getDepositById(@PathVariable String depositId) {
        Optional<Deposit> deposit = depositService.getDepositById(depositId);
        return deposit.isPresent() ?
                new ResponseEntity<>(deposit, HttpStatus.OK) :
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
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

    // Get unconfirmed deposits
    @GetMapping("/unconfirmed")
    public ResponseEntity<List<Deposit>> getUnconfirmedDeposits() {
        List<Deposit> deposits = depositService.getDepositsByStatus("unconfirmed");
        return new ResponseEntity<>(deposits, HttpStatus.OK);
    }

    // Get confirmed deposits
    @GetMapping("/confirmed")
    public ResponseEntity<List<Deposit>> getConfirmedDeposits() {
        List<Deposit> deposits = depositService.getDepositsByStatus("confirmed");
        return new ResponseEntity<>(deposits, HttpStatus.OK);
    }

    // Get declined deposits
    @GetMapping("/declined")
    public ResponseEntity<List<Deposit>> getDeclinedDeposits() {
        List<Deposit> deposits = depositService.getDepositsByStatus("declined");
        return new ResponseEntity<>(deposits, HttpStatus.OK);
    }

    // Confirm a deposit
    @PatchMapping("/confirm/{depositId}")
    public ResponseEntity<String> confirmDeposit(@PathVariable String depositId) {
        Optional<Deposit> deposit = depositService.getDepositById(depositId);
        if (deposit.isPresent()) {
            Deposit updatedDeposit = deposit.get();
            updatedDeposit.setStatus("confirmed");  // Mark as confirmed
            depositService.updateDeposit(updatedDeposit);
            return new ResponseEntity<>("Deposit confirmed successfully!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Deposit not found", HttpStatus.NOT_FOUND);
        }
    }

    // Decline a deposit with a reason
    @PatchMapping("/decline/{depositId}")
    public ResponseEntity<String> declineDeposit(
            @PathVariable String depositId,
            @RequestParam("reason") String reason
    ) {
        Optional<Deposit> deposit = depositService.getDepositById(depositId);
        if (deposit.isPresent()) {
            Deposit updatedDeposit = deposit.get();
            updatedDeposit.setStatus("declined");  // Mark as declined
            updatedDeposit.setDeclineReason(reason);  // Store decline reason
            depositService.updateDeposit(updatedDeposit);
            return new ResponseEntity<>("Deposit declined successfully!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Deposit not found", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{depositId}")
    public ResponseEntity<String> deleteDepositById(@PathVariable String depositId) {
        try {
            depositService.deleteDepositById(depositId);
            return new ResponseEntity<>("Deposit deleted successfully!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete deposit: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Deposit>> getAllDeposits() {
        List<Deposit> deposits = depositService.getAllDeposits();
        return new ResponseEntity<>(deposits, HttpStatus.OK);
    }

    @GetMapping("/confirmed/totalAmount/dealer/{dealerId}")
    public ResponseEntity<Double> getTotalConfirmedDepositAmountByDealerId(@PathVariable String dealerId) {
        List<Deposit> confirmedDeposits = depositService.getDepositsByDealerIdAndStatus(dealerId, "confirmed");

        double totalAmount = confirmedDeposits.stream()
                .mapToDouble(Deposit::getAmount)
                .sum();

        return new ResponseEntity<>(totalAmount, HttpStatus.OK);
    }

    @GetMapping("/unconfirmed/distributor/{distributorId}")
    public ResponseEntity<List<Deposit>> getUnconfirmedDepositsByDistributorId(@PathVariable String distributorId) {
        List<Deposit> deposits = depositService.getDepositsByDistributorIdAndStatus(distributorId, "unconfirmed");
        return new ResponseEntity<>(deposits, HttpStatus.OK);
    }

    // Get all confirmed deposits by distributor ID
    @GetMapping("/confirmed/distributor/{distributorId}")
    public ResponseEntity<List<Deposit>> getConfirmedDepositsByDistributorId(@PathVariable String distributorId) {
        List<Deposit> deposits = depositService.getDepositsByDistributorIdAndStatus(distributorId, "confirmed");
        return new ResponseEntity<>(deposits, HttpStatus.OK);
    }

    // Get all declined deposits by distributor ID
    @GetMapping("/declined/distributor/{distributorId}")
    public ResponseEntity<List<Deposit>> getDeclinedDepositsByDistributorId(@PathVariable String distributorId) {
        List<Deposit> deposits = depositService.getDepositsByDistributorIdAndStatus(distributorId, "declined");
        return new ResponseEntity<>(deposits, HttpStatus.OK);
    }

}
