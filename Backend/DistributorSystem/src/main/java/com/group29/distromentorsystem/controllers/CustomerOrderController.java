package com.group29.distromentorsystem.controllers;

import com.group29.distromentorsystem.models.CustomerOrder;
import com.group29.distromentorsystem.services.CustomerOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/getAllCustomerOrdersByDealerId/{dealerid}")
    public List<CustomerOrder> getAllCustomerOrdersByDealerId(@PathVariable String dealerid) {
        return customerOrderService.getCustomerOrdersByDealerId(dealerid);
    }

    // New method to get total order amount by dealer ID
    @GetMapping("/getTotalOrderAmountByDealer/{dealerId}")
    public double getTotalOrderAmountByDealer(@PathVariable String dealerId) {
        return customerOrderService.getTotalOrderAmountByDealer(dealerId);
    }

    // Update the total order amount (Total Sales) for a dealer by dealer ID
    @PutMapping("/updateTotalOrderAmountByDealer/{dealerId}")
    public void updateTotalOrderAmountByDealer(@PathVariable String dealerId, @RequestParam double updatedAmount) {
        customerOrderService.updateTotalOrderAmountByDealer(dealerId, updatedAmount);  // Updates the dealer's total sales
    }

    @GetMapping("/getCustomerOrderById/{orderid}")
    public CustomerOrder getCustomerOrderById(@PathVariable String orderid) {
        return customerOrderService.getCustomerOrderByOrderid(orderid);
    }
    @PutMapping("/{orderid}")
    public ResponseEntity<CustomerOrder> updateCustomerOrder(
            @PathVariable String orderid,
            @RequestBody CustomerOrder orderDetails) {
        try {
            // Call the service method to update the order
            CustomerOrder updatedOrder = customerOrderService.updateCustomerOrder(orderid, orderDetails);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            // Return 404 if the order is not found
            return ResponseEntity.notFound().build();
        }
    }

}
