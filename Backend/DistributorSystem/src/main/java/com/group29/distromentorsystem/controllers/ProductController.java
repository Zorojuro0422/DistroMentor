package com.group29.distromentorsystem.controllers;


import com.group29.distromentorsystem.models.Product;
import com.group29.distromentorsystem.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/product")
public class ProductController {

    @Autowired
    ProductService productService;

    @PostMapping("/createProduct")
    public ResponseEntity<Object> createProduct(@RequestBody Product product){
        productService.createProduct(product);

        return new ResponseEntity<>("Product created successfully!", HttpStatus.CREATED);

    }

    @GetMapping("/getAllProducts")
    public ResponseEntity<Object> getAllProducts(){
        return new ResponseEntity<>(productService.getAllProducts(), HttpStatus.OK);
    }
}

