package com.group29.distromentorsystem.services;

import com.group29.distromentorsystem.models.DealerTotals;
import com.group29.distromentorsystem.repositories.DealerTotalsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DealerTotalsService {

    @Autowired
    private DealerTotalsRepository dealerTotalsRepository;

    // Method to retrieve DealerTotals by dealer ID
    public DealerTotals getDealerTotalsByDealerId(String dealerid) {
        return dealerTotalsRepository.findByDealerid(dealerid)
                .orElseThrow(() -> new IllegalArgumentException("Dealer totals not found for dealer ID: " + dealerid));
    }

    // Method to update the DealerTotals by dealer ID
    public DealerTotals updateDealerTotals(String dealerid, double updatedOrderAmount, double updatedSRP, double updatedProfit) {
        DealerTotals dealerTotals = dealerTotalsRepository.findByDealerid(dealerid)
                .orElseThrow(() -> new IllegalArgumentException("Dealer totals not found for dealer ID: " + dealerid));

        dealerTotals.setTotalOrderAmount(updatedOrderAmount);
        dealerTotals.setTotalSRP(updatedSRP);
        dealerTotals.setProfit(updatedProfit);

        return dealerTotalsRepository.save(dealerTotals);
    }

    // Optional: Add a method to create a new DealerTotals if it doesn't exist
    public DealerTotals createDealerTotals(DealerTotals dealerTotals) {
        return dealerTotalsRepository.save(dealerTotals);
    }
}
