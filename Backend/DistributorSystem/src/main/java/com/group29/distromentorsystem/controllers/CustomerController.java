package com.group29.distromentorsystem.controllers;

import com.group29.distromentorsystem.models.Customer;
import com.group29.distromentorsystem.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@CrossOrigin
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    private static final Logger logger = Logger.getLogger(CustomerController.class.getName());

    @PostMapping("/createCustomer")
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerService.createCustomer(customer);
    }

    @GetMapping("/getAllCustomer")
    public List<Customer> getAllCustomer() {
        return customerService.getAllCustomer();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable String id) {
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable String id, @RequestBody Customer customerDetails) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customerDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/dealer/{dealerId}")
    public ResponseEntity<List<Customer>> getCustomersByDealerId(@PathVariable String dealerId) {
        logger.info("Fetching customers for dealerId: " + dealerId);
        List<Customer> customers = customerService.getCustomersByDealerId(dealerId);
        if (customers.isEmpty()) {
            logger.warning("No customers found for dealerId: " + dealerId);
            return ResponseEntity.notFound().build();
        }
        logger.info("Found customers for dealerId: " + dealerId);
        return ResponseEntity.ok(customers);
    }
}
