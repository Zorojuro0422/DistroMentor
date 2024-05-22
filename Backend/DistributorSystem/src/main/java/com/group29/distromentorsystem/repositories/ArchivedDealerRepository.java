package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.ArchivedDealer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArchivedDealerRepository extends MongoRepository<ArchivedDealer, String > {

    List<ArchivedDealer> findAllByDistributor_Distributorid(String distributorId);

}
