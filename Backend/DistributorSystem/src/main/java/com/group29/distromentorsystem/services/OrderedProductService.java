package com.group29.distromentorsystem.services;


import com.group29.distromentorsystem.repositories.OrderRepository;
import com.group29.distromentorsystem.models.Order;
import com.group29.distromentorsystem.models.OrderedProduct;
import com.group29.distromentorsystem.repositories.OrderedProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderedProductService {

    @Autowired
    OrderedProductRepository orderedProductRepository;

    @Autowired
    OrderRepository orderRepository;

    public OrderedProduct createOrderedProduct(OrderedProduct orderedProduct){
        return orderedProductRepository.save(orderedProduct);
    }

    public List<OrderedProduct> getAllOrderedProducts(){
        return orderedProductRepository.findAll();
    }

    public OrderedProduct addOrderedProduct(String orderid, OrderedProduct orderedProduct) {
        // Check if the provided orderid corresponds to an existing Order
        Optional<Order> existingOrder = orderRepository.findById(orderid);

        if (!existingOrder.isPresent()) {
            // The provided orderid does not match an existing Order, so handle this case
            // You might return an error response, throw an exception, or handle it based on your requirements.
            System.out.println("yawa");
        }

        // Set the orderid for the orderedProduct
        orderedProduct.setOrderid(orderid);

        // Save the orderedProduct
        OrderedProduct savedOrderedProduct = orderedProductRepository.save(orderedProduct);

        // Add the savedOrderedProduct to the Order's orderedproducts list
        Order order = existingOrder.get();
        order.getOrderedproducts().add(savedOrderedProduct);

        // Save the updated Order with the new OrderedProduct
        orderRepository.save(order);

        return savedOrderedProduct;
    }


    /*public Set<OrderedProduct> findByOrderid(String orderid){
       return orderedProductRepository.findByOrderid(orderid);
    }*/



}

