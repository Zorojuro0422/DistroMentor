package com.group29.distromentorsystem.services;

import com.group29.distromentorsystem.models.CustomerOrder;
import com.group29.distromentorsystem.models.OrderedProduct;
import com.group29.distromentorsystem.repositories.CustomerOrderRepository;
import com.group29.distromentorsystem.repositories.DealerTotalsRepository;
import com.group29.distromentorsystem.models.DealerTotals;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerOrderService {

    @Autowired
    private CustomerOrderRepository customerOrderRepository;

    @Autowired
    private DealerTotalsRepository dealerTotalsRepository;

    public CustomerOrder saveOrder(CustomerOrder customerOrder) {
        // Save the order
        CustomerOrder savedOrder = customerOrderRepository.save(customerOrder);

        // After saving the order, update the dealer's total order amount, total SRP, and profit
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

    // Get total SRP amount by dealer ID
    public double getTotalAmountSrpByDealer(String dealerId) {
        List<CustomerOrder> orders = customerOrderRepository.findByDealerid(dealerId);

        return orders.stream()
                .flatMap(order -> order.getOrderedproducts().stream())
                .mapToDouble(OrderedProduct::getTotalsrp)
                .sum(); // Sum all SRP values for products ordered by the dealer
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

        // Update the total SRP (add the SRP of the new order's products to the existing total SRP)
        double newSrp = order.getOrderedproducts().stream()
                .mapToDouble(OrderedProduct::getTotalsrp).sum();
        dealerTotals.setTotalSRP(dealerTotals.getTotalSRP() + newSrp);

        // Calculate new profit from this order
        double newProfit = newSrp - newOrderAmount;

        // Accumulate the new profit with the existing profit
        dealerTotals.setProfit(dealerTotals.getProfit() + newProfit);

        // Save the updated totals back to the database
        dealerTotalsRepository.save(dealerTotals);
    }

    // Update method to modify total order amount for a dealer (e.g., during corrections)
    public void updateTotalOrderAmountByDealer(String dealerId, double updatedAmount) {
        DealerTotals dealerTotals = dealerTotalsRepository.findByDealerid(dealerId)
                .orElseThrow(() -> new IllegalArgumentException("Dealer totals not found for dealer ID: " + dealerId));

        dealerTotals.setTotalOrderAmount(dealerTotals.getTotalOrderAmount() + updatedAmount); // Add to existing total

        // No need to recalculate the profit here, as it should be handled elsewhere when SRP is updated
        dealerTotalsRepository.save(dealerTotals);  // Save the updated totals
    }

    // Update method to modify total SRP amount for a dealer
    public void updateTotalAmountSrpByDealer(String dealerId, double updatedSrp) {
        DealerTotals dealerTotals = dealerTotalsRepository.findByDealerid(dealerId)
                .orElseThrow(() -> new IllegalArgumentException("Dealer totals not found for dealer ID: " + dealerId));

        dealerTotals.setTotalSRP(dealerTotals.getTotalSRP() + updatedSrp);  // Add to existing SRP

        // No need to recalculate the profit here, as it should be handled elsewhere when SRP is updated
        dealerTotalsRepository.save(dealerTotals);  // Save the updated totals
    }
}
