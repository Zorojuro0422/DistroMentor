package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.AllProductSubtotal;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AllProductSubtotalRepository extends MongoRepository<AllProductSubtotal, String> {
    Optional<AllProductSubtotal> findByDealerid(String dealerid);
}
