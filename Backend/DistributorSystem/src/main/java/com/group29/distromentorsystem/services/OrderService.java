package com.group29.distromentorsystem.services;

import com.group29.distromentorsystem.models.*;
import com.group29.distromentorsystem.repositories.*;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderedProductService orderedProductService;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    OrderedProductRepository orderedProductRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    DealerRepository dealerRepository;

    @Autowired
    DistributorRepository distributorRepository;

    public Order createOrder(Order order) {
        Order newOrder = orderRepository.save(order);

        double orderamount = 0;

        Dealer dealer = dealerRepository.findById(order.getDealer().getDealerid()).get();

        Distributor distributor = distributorRepository.findById(dealer.getDistributor().getDistributorid()).get();

        Set<OrderedProduct> newOrderedProducts = order.getOrderedproducts();
        Set<OrderedProduct> savedOrderedProducts = new HashSet<>();

        for (OrderedProduct op : newOrderedProducts) {
            String productid = op.getProduct().getProductid();
            int quantity = op.getQuantity();

            Product product = productRepository.findById(productid).get();

            if (product != null) {
                float price = product.getPrice();
                double subtotal = price * quantity;

                OrderedProduct newOrderedProduct = new OrderedProduct(op.getOrderedproductid(), quantity, op.getSubtotal(), product, newOrder.getOrderid());

                newOrderedProduct = orderedProductRepository.save(newOrderedProduct);

                savedOrderedProducts.add(newOrderedProduct);

                orderamount += subtotal;

                newOrderedProduct.setProduct(product);
                product.getOrderedproductids().add(newOrderedProduct.getOrderedproductid());
                productRepository.save(product);
                orderedProductRepository.save(newOrderedProduct);
            }
        }
        newOrder.setOrderedproducts(savedOrderedProducts);
        newOrder.setOrderamount(orderamount);

        dealer.getOrderids().add(newOrder.getOrderid());
        dealerRepository.save(dealer);

        newOrder.setDistributor(distributor);
        distributor.getOrderids().add(newOrder.getOrderid());
        distributorRepository.save(distributor);

        return orderRepository.save(newOrder);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getAllConfirmedOrdersByDealerId(String dealerId) {
        return orderRepository.findAllByDealerDealeridAndIsconfirmedTrue(dealerId);
    }

    public Optional<Order> getOrderByID(String orderid) {
        return orderRepository.findById(orderid);
    }

    public List<Order> getAllOrdersByDistributorID(String distributorid) {
        return orderRepository.findAllByDistributor_Distributorid(distributorid);
    }

    public ResponseEntity assignCollector(String[] orderids, String collectorid) {
        Employee employee = employeeRepository.findById(collectorid).get();

        for (String orderId : orderids) {
            Order order = orderRepository.findById(orderId).get();

            if (order != null) {
                if (order.getCollector() != null) {
                    Employee prevEmployee = order.getCollector();
                    prevEmployee.getOrderids().remove(order.getOrderid());
                    employeeRepository.save(prevEmployee);
                }

                order.setCollector(employee);
                orderRepository.save(order);

                employee.getOrderids().add(order.getOrderid());
            }
        }

        employeeRepository.save(employee);
        return new ResponseEntity("Collector assigned successfully", HttpStatus.OK);
    }

    public ResponseEntity removeCollector(String orderid) {
        Order order = orderRepository.findById(orderid).get();

        Employee employee = employeeRepository.findById(order.getCollector().getEmployeeid()).get();
        employee.getOrderids().remove(orderid);
        employeeRepository.save(employee);

        order.setCollector(null);
        orderRepository.save(order);

        return new ResponseEntity("Collector removed successfully", HttpStatus.OK);
    }

    public ResponseEntity updateOrder(String orderId, Order updatedOrder) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);

        if (optionalOrder.isPresent()) {
            Order existingOrder = optionalOrder.get();

            // Update fields in the existing order
            existingOrder.setPenaltyrate(updatedOrder.getPenaltyrate());
            existingOrder.setDistributiondate(updatedOrder.getDistributiondate());
            existingOrder.setPaymentterms(updatedOrder.getPaymentterms());
            existingOrder.setOrderedproducts(updatedOrder.getOrderedproducts());
            existingOrder.setOrderamount(updatedOrder.getOrderamount());
            existingOrder.setConfirmed(updatedOrder.getConfirmed());
            existingOrder.setStatus(updatedOrder.getStatus()); // Updated for status

            // Handle deposit safely without null issues
            Double newDeposit = updatedOrder.getDeposit();
            if (newDeposit != null) { // Only update if newDeposit is not null
                existingOrder.setDeposit(newDeposit); // Frontend already calculates the total deposit
            }

            // Update the order ID for ordered products
            if (updatedOrder.getOrderedproducts() != null) {
                for (OrderedProduct op : updatedOrder.getOrderedproducts()) {
                    op.setOrderid(updatedOrder.getOrderid());
                }
            }

            // Save the updated order
            orderRepository.save(existingOrder);

            return new ResponseEntity<>("Order updated successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Order not found", HttpStatus.NOT_FOUND);
        }
    }



    @Scheduled(cron = "0 0 0 */15 * ?")
    public void applyPenaltyForAllLatePayments() {
        LocalDate currentDate = LocalDate.now();
        List<Order> orders = orderRepository.findAll();

        // Logic for penalty calculation can be implemented here
    }

    public List<Order> getAllUnconfirmedOrders() {
        return orderRepository.findByIsconfirmedFalse();
    }

    public List<Order> getOrderByDealerId(String dealerId) {
        return orderRepository.findByDealer_Dealerid(dealerId);
    }

    public List<Order> getAllUnconfirmedOrdersByDistributorID(String distributorid) {
        return orderRepository.findByDistributor_DistributoridAndIsconfirmedFalse(distributorid);
    }

    public Order getOrderByIDUnderDistributor(String orderid, String distributorid) {
        boolean exists = orderRepository.existsByOrderidAndDistributor_Distributorid(orderid, distributorid);
        if (exists) {
            return orderRepository.findById(orderid).orElse(null);
        } else
            return null;
    }

    public Double getTotalOrderedProductsSubtotalByDealerId(String dealerid) {
        Double totalSubtotal = orderRepository.sumOrderedProductsSubtotalByDealerId(dealerid);
        return totalSubtotal != null ? totalSubtotal : 0.0;
    }
}
