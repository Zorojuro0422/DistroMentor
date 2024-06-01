package com.group29.distromentorsystem.repositories;
import com.group29.distromentorsystem.models.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
}
