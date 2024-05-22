package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.Dealer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DealerRepository extends MongoRepository<Dealer, String> {
    Dealer findByDealeridAndPassword(String dealerid, String password);
    Optional<Dealer> findById(String id);

    List<Dealer> findByIsconfirmedFalse();

    List<Dealer> findByDistributor_DistributoridAndIsconfirmedFalse(String distributorId);

    List<Dealer> findAllByDistributor_Distributorid(String distributorId);

}
