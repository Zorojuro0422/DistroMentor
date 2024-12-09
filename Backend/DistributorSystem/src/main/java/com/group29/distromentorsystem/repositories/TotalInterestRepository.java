package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.TotalInterest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TotalInterestRepository extends MongoRepository<TotalInterest, String> {
    // Custom query methods can be added if needed
}