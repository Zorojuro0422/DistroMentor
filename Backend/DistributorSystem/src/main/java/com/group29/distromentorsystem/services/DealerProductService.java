package com.group29.distromentorsystem.services;

import com.group29.distromentorsystem.models.DealerProduct;
import com.group29.distromentorsystem.repositories.DealerProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DealerProductService {

    @Autowired
    private DealerProductRepository dealerProductRepository;

    // Get all dealer products
    public List<DealerProduct> getAllDealerProducts() {
        return dealerProductRepository.findAll();
    }

    // Get a dealer product by ID
    public Optional<DealerProduct> getDealerProductById(String dealerproductid) {
        return dealerProductRepository.findById(dealerproductid);
    }

    // Get products by dealer ID
    public List<DealerProduct> getDealerProductsByDealerId(String dealerid) {
        return dealerProductRepository.findByDealerid(dealerid);
    }

    // Add a new dealer product
    public DealerProduct addDealerProduct(DealerProduct dealerProduct) {
        return dealerProductRepository.save(dealerProduct);
    }

    // Update a dealer product by ID
    public DealerProduct updateDealerProduct(String dealerproductid, DealerProduct dealerProduct) {
        return dealerProductRepository.findById(dealerproductid)
                .map(existingProduct -> {
                    existingProduct.setName(dealerProduct.getName());
                    existingProduct.setQuantity(dealerProduct.getQuantity());
                    existingProduct.setUnit(dealerProduct.getUnit());
                    existingProduct.setPrice(dealerProduct.getPrice());
                    existingProduct.setDealerid(dealerProduct.getDealerid()); // Updating dealerid if needed
                    return dealerProductRepository.save(existingProduct);
                })
                .orElseGet(() -> {
                    dealerProduct.setDealerproductid(dealerproductid);
                    return dealerProductRepository.save(dealerProduct);
                });
    }

    // Delete a dealer product by ID
    public void deleteDealerProduct(String dealerproductid) {
        dealerProductRepository.deleteById(dealerproductid);
    }

    public Optional<DealerProduct> getDealerProductByDealerIdAndProductId(String dealerid, String productid) {
        return dealerProductRepository.findByDealeridAndProductid(dealerid, productid);
    }
}