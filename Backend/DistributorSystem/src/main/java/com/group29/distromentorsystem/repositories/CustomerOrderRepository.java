package com.group29.distromentorsystem.repositories;


import com.group29.distromentorsystem.models.CustomerOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CustomerOrderRepository extends MongoRepository<CustomerOrder, String> {
    List<CustomerOrder> findByDealerid(String dealerid);
    Optional<CustomerOrder> findByOrderid(String orderid);



}
