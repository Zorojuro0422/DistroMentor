package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.TotalInterest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TotalInterestRepository extends MongoRepository<TotalInterest, String> {
    // Custom query method to find by orderId instead of dealerId
    Optional<TotalInterest> findByOrderId(String orderId);
}
