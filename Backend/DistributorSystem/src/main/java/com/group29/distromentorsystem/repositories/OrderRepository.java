package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByIsconfirmedFalse();
    List<Order> findByDealer_Dealerid(String dealerId);

    List<Order> findByDistributor_DistributoridAndIsconfirmedFalse(String distributorId);

    List<Order> findAllByDistributor_Distributorid(String distributorId);



    Order findByDistributor_Distributorid(String distributorId);

    boolean existsByOrderidAndDistributor_Distributorid(String orderId, String distributorId);

}
