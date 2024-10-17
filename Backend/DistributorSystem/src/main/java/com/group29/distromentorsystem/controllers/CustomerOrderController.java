package com.group29.distromentorsystem.controllers;

import com.group29.distromentorsystem.models.CustomerOrder;
import com.group29.distromentorsystem.services.CustomerOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/customerOrder")
public class CustomerOrderController {
    @Autowired
    private CustomerOrderService customerOrderService;

    @PostMapping("/newOrder")
    public CustomerOrder createOrder(@RequestBody CustomerOrder customerOrder) {
        return customerOrderService.saveOrder(customerOrder);
    }
    @GetMapping("/getAllCustomerOrders")
    public List<CustomerOrder> getAllCustomerOrders() {
        return customerOrderService.getAllCustomerOrders();
    }

    // New method to get total order amount by dealer ID
    @GetMapping("/getTotalOrderAmountByDealer/{dealerId}")
    public double getTotalOrderAmountByDealer(@PathVariable String dealerId) {
        return customerOrderService.getTotalOrderAmountByDealer(dealerId);
    }

    @GetMapping("/getTotalAmountSrpByDealer/{dealerId}")
    public double getTotalAmountSrpByDealer(@PathVariable String dealerId) {
        return customerOrderService.getTotalAmountSrpByDealer(dealerId);
    }

    // Update the total order amount (Total Sales) for a dealer by dealer ID
    @PutMapping("/updateTotalOrderAmountByDealer/{dealerId}")
    public void updateTotalOrderAmountByDealer(@PathVariable String dealerId, @RequestParam double updatedAmount) {
        customerOrderService.updateTotalOrderAmountByDealer(dealerId, updatedAmount);  // Updates the dealer's total sales
    }

    // Update the total SRP amount for a dealer by dealer ID
    @PutMapping("/updateTotalAmountSrpByDealer/{dealerId}")
    public void updateTotalAmountSrpByDealer(@PathVariable String dealerId, @RequestParam double updatedSrp) {
        customerOrderService.updateTotalAmountSrpByDealer(dealerId, updatedSrp);  // Updates the dealer's total SRP
    }
}