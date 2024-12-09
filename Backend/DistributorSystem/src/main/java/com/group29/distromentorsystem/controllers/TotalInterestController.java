package com.group29.distromentorsystem.controllers;

import com.group29.distromentorsystem.models.TotalInterest;
import com.group29.distromentorsystem.services.TotalInterestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/total-interest")
public class TotalInterestController {

    @Autowired
    private TotalInterestService totalInterestService;

    // Get TotalInterest by Dealer ID
    @GetMapping("/{dealerId}")
    public ResponseEntity<TotalInterest> getTotalInterest(@PathVariable String dealerId) {
        Optional<TotalInterest> totalInterest = totalInterestService.getTotalInterestByDealerId(dealerId);
        return totalInterest.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create or Update TotalInterest
    @PostMapping("/{dealerId}")
    public ResponseEntity<TotalInterest> addInterest(@PathVariable String dealerId, @RequestParam double interest) {
        TotalInterest updatedTotalInterest = totalInterestService.createOrUpdateTotalInterest(dealerId, interest);
        return ResponseEntity.ok(updatedTotalInterest);
    }

    // Delete TotalInterest by Dealer ID
    @DeleteMapping("/{dealerId}")
    public ResponseEntity<String> deleteTotalInterest(@PathVariable String dealerId) {
        totalInterestService.deleteTotalInterest(dealerId);
        return ResponseEntity.ok("Total interest record deleted successfully.");
    }
}
