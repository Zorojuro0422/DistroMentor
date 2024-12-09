package com.group29.distromentorsystem.services;

import com.group29.distromentorsystem.models.CustomerOrder;
import com.group29.distromentorsystem.models.OrderedProduct;
import com.group29.distromentorsystem.repositories.CustomerOrderRepository;
import com.group29.distromentorsystem.repositories.DealerTotalsRepository;
import com.group29.distromentorsystem.models.DealerTotals;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerOrderService {

    @Autowired
    private CustomerOrderRepository customerOrderRepository;

    @Autowired
    private DealerTotalsRepository dealerTotalsRepository;

    public List<CustomerOrder> getCustomerOrdersByDealerId(String dealerid) {
        return customerOrderRepository.findByDealerid(dealerid);
    }

    public CustomerOrder saveOrder(CustomerOrder customerOrder) {
        // Save the order
        CustomerOrder savedOrder = customerOrderRepository.save(customerOrder);

        // After saving the order, update the dealer's total order amount
        updateDealerTotals(savedOrder);

        return savedOrder;
    }

    // Retrieve all customer orders
    public List<CustomerOrder> getAllCustomerOrders() {
        return customerOrderRepository.findAll();
    }

    // Get total order amount (Total Sales) by dealer ID
    public double getTotalOrderAmountByDealer(String dealerId) {
        List<CustomerOrder> orders = customerOrderRepository.findByDealerid(dealerId);
        return orders.stream().mapToDouble(CustomerOrder::getOrderamount).sum(); // Sum all order amounts
    }

    // Update dealer totals when an order is placed
    public void updateDealerTotals(CustomerOrder order) {
        String dealerId = order.getDealerid();

        // Fetch existing totals or create new ones if not present
        DealerTotals dealerTotals = dealerTotalsRepository.findByDealerid(dealerId)
                .orElse(new DealerTotals(dealerId, 0.0, 0.0, 0.0));

        // Update the total order amount (add the new order amount to the existing total)
        double newOrderAmount = order.getOrderamount();
        dealerTotals.setTotalOrderAmount(dealerTotals.getTotalOrderAmount() + newOrderAmount);

        // Save the updated totals back to the database
        dealerTotalsRepository.save(dealerTotals);
    }

    // Update method to modify total order amount for a dealer (e.g., during corrections)
    public void updateTotalOrderAmountByDealer(String dealerId, double updatedAmount) {
        DealerTotals dealerTotals = dealerTotalsRepository.findByDealerid(dealerId)
                .orElseThrow(() -> new IllegalArgumentException("Dealer totals not found for dealer ID: " + dealerId));

        dealerTotals.setTotalOrderAmount(dealerTotals.getTotalOrderAmount() + updatedAmount); // Add to existing total

        dealerTotalsRepository.save(dealerTotals);  // Save the updated totals
    }

    public CustomerOrder getCustomerOrderByOrderid(String orderid) {
        return customerOrderRepository.findByOrderid(orderid)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderid));

    }

    public CustomerOrder updateCustomerOrder(String orderid, CustomerOrder orderDetails) {
        // Fetch the existing order
        CustomerOrder existingOrder = customerOrderRepository.findById(orderid)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderid));

        // Update fields
        existingOrder.setCustomerid(orderDetails.getCustomerid());
        existingOrder.setDealerid(orderDetails.getDealerid());
        existingOrder.setDistributiondate(orderDetails.getDistributiondate());
        existingOrder.setOrderdate(orderDetails.getOrderdate());
        existingOrder.setOrderamount(orderDetails.getOrderamount());
        existingOrder.setDeposit(orderDetails.getDeposit());
        existingOrder.setStatus(orderDetails.getStatus());

        // Save and return the updated order
        return customerOrderRepository.save(existingOrder);
    }

}
