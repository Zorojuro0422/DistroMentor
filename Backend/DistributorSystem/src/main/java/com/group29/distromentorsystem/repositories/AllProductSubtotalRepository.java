package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.AllProductSubtotal;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AllProductSubtotalRepository extends MongoRepository<AllProductSubtotal, String> {
    Optional<AllProductSubtotal> findByDealerid(String dealerid);
}
