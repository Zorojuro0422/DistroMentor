package com.group29.distromentorsystem.services;

import com.group29.distromentorsystem.models.Customer;
import com.group29.distromentorsystem.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomer() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(String customerID) {
        return customerRepository.findById(customerID);
    }

    public List<Customer> getCustomersByDealerId(String dealerId) {
        return customerRepository.findByDealerID(dealerId);
    }

    public Customer updateCustomer(String customerID, Customer customerDetails) {
        Customer customer = customerRepository.findById(customerID)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setDealerID(customerDetails.getDealerID());
        customer.setFirstName(customerDetails.getFirstName());
        customer.setLastName(customerDetails.getLastName());
        customer.setCustomerContactNumber(customerDetails.getCustomerContactNumber());
        customer.setCustomerAddress(customerDetails.getCustomerAddress());
        customer.setCustomerSalesAmount(customerDetails.getCustomerSalesAmount());

        return customerRepository.save(customer);
    }

    public void deleteCustomer(String customerID) {
        Customer customer = customerRepository.findById(customerID)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customerRepository.delete(customer);
    }
}