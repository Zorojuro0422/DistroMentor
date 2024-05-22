package com.group29.distromentorsystem.repositories;


import com.group29.distromentorsystem.models.OrderedProduct;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderedProductRepository extends MongoRepository<OrderedProduct, String> {

    // Set<OrderedProduct> findByOrderid(String orderid);
}
