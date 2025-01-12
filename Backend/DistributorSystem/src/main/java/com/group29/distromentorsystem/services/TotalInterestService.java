package com.group29.distromentorsystem.services;

import com.group29.distromentorsystem.models.TotalInterest;
import com.group29.distromentorsystem.repositories.TotalInterestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TotalInterestService {

    @Autowired
    private TotalInterestRepository totalInterestRepository;

    // Get TotalInterest by Order ID
    public Optional<TotalInterest> getTotalInterestByOrderId(String orderId) {
        return totalInterestRepository.findByOrderId(orderId);  // Use findByOrderId instead of findById
    }

    // Update TotalInterest by Order ID (PUT method)
    public TotalInterest updateTotalInterestByOrderId(String orderId, double interest) {
        TotalInterest totalInterest = totalInterestRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("TotalInterest for orderId " + orderId + " not found"));

        totalInterest.setInterest(totalInterest.getInterest() + interest); // Update the interest

        return totalInterestRepository.save(totalInterest); // Save updated TotalInterest
    }

    // Create or Update TotalInterest
    public TotalInterest createOrUpdateTotalInterest(String orderId, double interest) {
        TotalInterest totalInterest = totalInterestRepository.findByOrderId(orderId)
                .orElse(new TotalInterest(orderId, 0.0));  // Use orderId here
        totalInterest.setInterest(totalInterest.getInterest() + interest); // Add to existing interest
        return totalInterestRepository.save(totalInterest);
    }

    // Delete TotalInterest by Order ID
    public void deleteTotalInterest(String orderId) {
        totalInterestRepository.deleteById(orderId);  // Use orderId here
    }
}
