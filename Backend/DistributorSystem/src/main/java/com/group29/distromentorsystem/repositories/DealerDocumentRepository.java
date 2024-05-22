package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.DealerDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DealerDocumentRepository extends MongoRepository <DealerDocument, String> {

    Iterable<DealerDocument> findByDealer_Dealerid(String dealerid);

}
