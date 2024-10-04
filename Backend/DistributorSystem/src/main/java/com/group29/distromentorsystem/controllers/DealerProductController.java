package com.group29.distromentorsystem.controllers;

import com.group29.distromentorsystem.models.DealerProduct;
import com.group29.distromentorsystem.services.DealerProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/dealer-products")
public class DealerProductController {

    @Autowired
    private DealerProductService dealerProductService;

    // Get all dealer products
    @GetMapping
    public List<DealerProduct> getAllDealerProducts() {
        return dealerProductService.getAllDealerProducts();
    }

    // Get a dealer product by ID
    @GetMapping("/{dealerproductid}")
    public Optional<DealerProduct> getDealerProductById(@PathVariable String dealerproductid) {
        return dealerProductService.getDealerProductById(dealerproductid);
    }

    // Get dealer products by dealer ID
    @GetMapping("/dealer/{dealerid}")
    public List<DealerProduct> getDealerProductsByDealerId(@PathVariable String dealerid) {
        return dealerProductService.getDealerProductsByDealerId(dealerid);
    }

    // Add a new dealer product
    @PostMapping
    public DealerProduct addDealerProduct(@RequestBody DealerProduct dealerProduct) {
        return dealerProductService.addDealerProduct(dealerProduct);
    }

    // Update a dealer product by ID
    @PutMapping("/{dealerproductid}")
    public DealerProduct updateDealerProduct(@PathVariable String dealerproductid, @RequestBody DealerProduct dealerProduct) {
        return dealerProductService.updateDealerProduct(dealerproductid, dealerProduct);
    }

    // Delete a dealer product by ID
    @DeleteMapping("/{dealerproductid}")
    public void deleteDealerProduct(@PathVariable String dealerproductid) {
        dealerProductService.deleteDealerProduct(dealerproductid);
    }
}
