package com.group29.distromentorsystem.controllers;

import com.group29.distromentorsystem.models.TotalInterest;
import com.group29.distromentorsystem.services.TotalInterestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/total-interest")
public class TotalInterestController {

    @Autowired
    private TotalInterestService totalInterestService;

    // Get TotalInterest by Order ID
    @GetMapping("/{orderId}")
    public ResponseEntity<TotalInterest> getTotalInterest(@PathVariable String orderId) {
        Optional<TotalInterest> totalInterest = totalInterestService.getTotalInterestByOrderId(orderId);
        return totalInterest.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create or Update TotalInterest
    @PostMapping("/{orderId}")
    public ResponseEntity<TotalInterest> addInterest(@PathVariable String orderId, @RequestParam double interest) {
        TotalInterest updatedTotalInterest = totalInterestService.createOrUpdateTotalInterest(orderId, interest);
        return ResponseEntity.ok(updatedTotalInterest);
    }

    // Delete TotalInterest by Order ID
    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> deleteTotalInterest(@PathVariable String orderId) {
        totalInterestService.deleteTotalInterest(orderId);
        return ResponseEntity.ok("Total interest record deleted successfully.");
    }

    // Update TotalInterest by Order ID (PUT method)
    @PutMapping("/{orderId}")
    public ResponseEntity<TotalInterest> updateInterest(@PathVariable String orderId, @RequestParam double interest) {
        TotalInterest updatedTotalInterest = totalInterestService.updateTotalInterestByOrderId(orderId, interest);
        return ResponseEntity.ok(updatedTotalInterest);
    }
}
