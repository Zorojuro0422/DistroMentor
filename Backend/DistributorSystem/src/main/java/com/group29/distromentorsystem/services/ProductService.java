package com.group29.distromentorsystem.services;


import com.group29.distromentorsystem.models.Product;
import com.group29.distromentorsystem.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Method to save a product
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Method to retrieve all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Method to retrieve a product by its ID
    public Optional<Product> getProductById(String productId) {
        return productRepository.findById(productId);
    }

    // Method to delete a product by its ID
    public void deleteProductById(String productId) {
        productRepository.deleteById(productId);
    }

    // Method to update a product
    public Product updateProduct(String productId, Product updatedProduct) {
        Optional<Product> existingProductOptional = productRepository.findById(productId);
        if (existingProductOptional.isPresent()) {
            Product existingProduct = existingProductOptional.get();
            // Update fields of existingProduct with fields from updatedProduct
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setUnit(updatedProduct.getUnit());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setQuantity(updatedProduct.getQuantity());
            // Save the updated product
            return productRepository.save(existingProduct);
        } else {
            throw new IllegalArgumentException("Product with ID " + productId + " not found.");
        }
    }
}
