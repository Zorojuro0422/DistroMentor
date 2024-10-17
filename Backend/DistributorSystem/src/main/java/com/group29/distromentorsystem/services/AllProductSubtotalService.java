package com.group29.distromentorsystem.services;

import com.group29.distromentorsystem.models.AllProductSubtotal;
import com.group29.distromentorsystem.repositories.AllProductSubtotalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AllProductSubtotalService {

    @Autowired
    private AllProductSubtotalRepository allProductSubtotalRepository;

    public Optional<AllProductSubtotal> getProductSubtotalByDealerId(String dealerId) {
        return allProductSubtotalRepository.findByDealerid(dealerId);
    }

    public AllProductSubtotal saveOrUpdateProductSubtotal(AllProductSubtotal productSubtotal) {
        Optional<AllProductSubtotal> existingSubtotalOpt = allProductSubtotalRepository.findById(productSubtotal.getDealerid());

        if (existingSubtotalOpt.isPresent()) {
            // If the subtotal already exists, add the new amount to the existing subtotal
            AllProductSubtotal existingSubtotal = existingSubtotalOpt.get();
            double updatedTotal = existingSubtotal.getTotalProductSubtotal() + productSubtotal.getTotalProductSubtotal();
            existingSubtotal.setTotalProductSubtotal(updatedTotal);  // Set the new total
            return allProductSubtotalRepository.save(existingSubtotal);  // Save the updated subtotal
        } else {
            // If no subtotal exists, save the new subtotal entry as is
            return allProductSubtotalRepository.save(productSubtotal);
        }
    }

    public AllProductSubtotal updateProductSubtotalByDealerId(String dealerId, AllProductSubtotal updatedSubtotal) {
        Optional<AllProductSubtotal> existingSubtotal = allProductSubtotalRepository.findByDealerid(dealerId);

        if (existingSubtotal.isPresent()) {
            AllProductSubtotal currentSubtotal = existingSubtotal.get();
            currentSubtotal.setTotalProductSubtotal(updatedSubtotal.getTotalProductSubtotal()); // Update the totalProductSubtotal
            return allProductSubtotalRepository.save(currentSubtotal); // Save the updated subtotal
        } else {
            // If no existing record, create a new one
            return allProductSubtotalRepository.save(updatedSubtotal);
        }
    }

}
