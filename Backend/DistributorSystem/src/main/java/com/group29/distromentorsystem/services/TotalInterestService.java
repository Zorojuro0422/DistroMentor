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

    // Get TotalInterest by Dealer ID
    public Optional<TotalInterest> getTotalInterestByDealerId(String dealerId) {
        return totalInterestRepository.findById(dealerId);
    }

    // Create or Update TotalInterest
    public TotalInterest createOrUpdateTotalInterest(String dealerId, double interest) {
        TotalInterest totalInterest = totalInterestRepository.findById(dealerId)
                .orElse(new TotalInterest(dealerId, 0.0));
        totalInterest.setInterest(totalInterest.getInterest() + interest); // Add to existing interest
        return totalInterestRepository.save(totalInterest);
    }

    // Delete TotalInterest by Dealer ID
    public void deleteTotalInterest(String dealerId) {
        totalInterestRepository.deleteById(dealerId);
    }
}