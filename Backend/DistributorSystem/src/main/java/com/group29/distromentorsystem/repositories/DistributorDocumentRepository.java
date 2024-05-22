package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.DistributorDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DistributorDocumentRepository extends MongoRepository <DistributorDocument, String> {

    Iterable<DistributorDocument> findByDistributor_Distributorid(String employeeid);

}
