package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.DealerProduct;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DealerProductRepository extends MongoRepository<DealerProduct, String> {

    // Custom method to find products by dealerid
    List<DealerProduct> findByDealerid(String dealerid);

    // Custom method to find products by name
    List<DealerProduct> findByName(String name);
}