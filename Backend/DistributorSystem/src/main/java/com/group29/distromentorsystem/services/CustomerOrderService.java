package com.group29.distromentorsystem.services;
import com.group29.distromentorsystem.models.CustomerOrder;
import com.group29.distromentorsystem.repositories.CustomerOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerOrderService {
    @Autowired
    private CustomerOrderRepository customerOrderRepository;

    public CustomerOrder saveOrder(CustomerOrder customerOrder) {
        return customerOrderRepository.save(customerOrder);
    }
    public List<CustomerOrder> getAllCustomerOrders() {
        return customerOrderRepository.findAll();
    }
}