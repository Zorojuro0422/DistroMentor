package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.Order;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByIsconfirmedFalse();
    List<Order> findByDealer_Dealerid(String dealerId);

    List<Order> findByDistributor_DistributoridAndIsconfirmedFalse(String distributorId);

    List<Order> findAllByDistributor_Distributorid(String distributorId);

    List<Order> findAllByDealerDealeridAndIsconfirmedTrue(String dealerid);

    Order findByDistributor_Distributorid(String distributorId);

    boolean existsByOrderidAndDistributor_Distributorid(String orderId, String distributorId);

    // Aggregation to sum the subtotal from orderedproducts for all orders by dealerid
    @Aggregation(pipeline = {
            "{ '$match': { 'dealer._id': ?0, 'isconfirmed': true } }",  // Match the dealer by dealerid
            "{ '$unwind': '$orderedproducts' }",   // Unwind the orderedproducts array
            "{ '$group': { '_id': null, 'totalSubtotal': { '$sum': '$orderedproducts.subtotal' } } }"  // Sum the subtotal
    })
    Double sumOrderedProductsSubtotalByDealerId(String dealerid);

}
