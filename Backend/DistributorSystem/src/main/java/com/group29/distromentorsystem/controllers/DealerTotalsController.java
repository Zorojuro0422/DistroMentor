package com.group29.distromentorsystem.controllers;

import com.group29.distromentorsystem.models.DealerTotals;
import com.group29.distromentorsystem.services.DealerTotalsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/dealerTotals")
public class DealerTotalsController {

    @Autowired
    private DealerTotalsService dealerTotalsService;

    // Endpoint to get DealerTotals by dealer ID
    @GetMapping("/getByDealerId/{dealerId}")
    public DealerTotals getDealerTotalsByDealerId(@PathVariable String dealerId) {
        return dealerTotalsService.getDealerTotalsByDealerId(dealerId);
    }

    // Endpoint to update DealerTotals by dealer ID (without updatedProductSubtotal)
    @PutMapping("/updateByDealerId/{dealerId}")
    public DealerTotals updateDealerTotals(
            @PathVariable String dealerId,
            @RequestBody Map<String, Double> totals) {

        double totalOrderAmount = totals.get("totalOrderAmount");  // Fetch the correct key
        double totalSRP = totals.get("totalSRP");
        double profit = totals.get("profit");

        return dealerTotalsService.updateDealerTotals(dealerId, totalOrderAmount, totalSRP, profit);
    }
}
