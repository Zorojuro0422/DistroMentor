package com.group29.distromentorsystem.repositories;


import com.group29.distromentorsystem.models.CustomerOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CustomerOrderRepository extends MongoRepository<CustomerOrder, String> {
}
