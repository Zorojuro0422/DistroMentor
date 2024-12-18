package com.group29.distromentorsystem.repositories;


import com.group29.distromentorsystem.models.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByDistributorid(String distributorid);
}
