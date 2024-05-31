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

    // You can add more methods here as needed, such as updating a product, searching for products by name, etc.
}
