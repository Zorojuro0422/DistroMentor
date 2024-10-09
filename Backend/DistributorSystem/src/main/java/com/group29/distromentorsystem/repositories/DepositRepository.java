package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.Deposit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepositRepository extends MongoRepository<Deposit, String> {
    // Custom query to find deposits by dealer ID
    List<Deposit> findByDealerid(String dealerId);

    // Custom query to find deposits by distributor ID
    List<Deposit> findByDistributorid(String distributorId);

    // Custom query to find all pending deposits
    List<Deposit> findByStatus(String status);
}
