package com.group29.distromentorsystem.controllers;

import com.group29.distromentorsystem.models.AllProductSubtotal;
import com.group29.distromentorsystem.services.AllProductSubtotalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/allProductSubtotals")
public class AllProductSubtotalController {

    @Autowired
    private AllProductSubtotalService allProductSubtotalService;

    // Get product subtotal by dealer ID
    @GetMapping("/getByDealerId/{dealerId}")
    public Optional<AllProductSubtotal> getProductSubtotalByDealerId(@PathVariable String dealerId) {
        return allProductSubtotalService.getProductSubtotalByDealerId(dealerId);
    }

    // Update or save product subtotal
    @PostMapping("/saveOrUpdate")
    public AllProductSubtotal saveOrUpdateProductSubtotal(@RequestBody AllProductSubtotal productSubtotal) {
        return allProductSubtotalService.saveOrUpdateProductSubtotal(productSubtotal);
    }

    // Update product subtotal by dealer ID
    @PutMapping("/updateByDealerId/{dealerId}")
    public AllProductSubtotal updateProductSubtotal(@PathVariable String dealerId, @RequestBody AllProductSubtotal updatedSubtotal) {
        return allProductSubtotalService.updateProductSubtotalByDealerId(dealerId, updatedSubtotal);
    }
}
