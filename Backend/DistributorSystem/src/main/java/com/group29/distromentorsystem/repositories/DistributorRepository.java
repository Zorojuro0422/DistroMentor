package com.group29.distromentorsystem.repositories;


import com.group29.distromentorsystem.models.Distributor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DistributorRepository extends MongoRepository<Distributor, String> {
    Optional<Distributor> findById(String id);
}
