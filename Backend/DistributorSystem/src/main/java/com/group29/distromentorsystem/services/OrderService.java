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
    private AllProductSubtotalService allProductSubtotalService;

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
        double orderamountsrp = 0;  // Initialize orderamountsrp

        Dealer dealer = dealerRepository.findById(order.getDealer().getDealerid()).get();
        Distributor distributor = distributorRepository.findById(dealer.getDistributor().getDistributorid()).get();

        Set<OrderedProduct> newOrderedProducts = order.getOrderedproducts();
        Set<OrderedProduct> savedOrderedProducts = new HashSet<>();

        for (OrderedProduct op : newOrderedProducts) {
            String productid = op.getProduct().getProductid();
            int quantity = op.getQuantity();

            Product product = productRepository.findById(productid).orElse(null);

            if (product != null) {
                float price = product.getPrice();
                float srp = product.getSuggestedRetailPrice();  // Retrieve SRP from the product

                double subtotal = price * quantity;
                double totalsrp = srp * quantity;  // Calculate SRP total for this product

                OrderedProduct newOrderedProduct = new OrderedProduct(
                        op.getOrderedproductid(), quantity, subtotal, totalsrp, product, newOrder.getOrderid()
                );

                newOrderedProduct = orderedProductRepository.save(newOrderedProduct);
                savedOrderedProducts.add(newOrderedProduct);

                orderamount += subtotal;
                orderamountsrp += totalsrp;  // Accumulate SRP totals for the entire order

                product.getOrderedproductids().add(newOrderedProduct.getOrderedproductid());
                productRepository.save(product);
            }
        }

        newOrder.setOrderedproducts(savedOrderedProducts);
        newOrder.setOrderamount(orderamount);
        newOrder.setOrderamountsrp(orderamountsrp);  // Set orderamountsrp

        dealer.getOrderids().add(newOrder.getOrderid());
        dealerRepository.save(dealer);

        newOrder.setDistributor(distributor);
        distributor.getOrderids().add(newOrder.getOrderid());
        distributorRepository.save(distributor);

        updateAllProductSubtotal(order.getDealer().getDealerid(), orderamount);

        return orderRepository.save(newOrder);
    }

    // Method to update AllProductSubtotal for the dealer
    private void updateAllProductSubtotal(String dealerId, double newOrderSubtotal) {
        Optional<AllProductSubtotal> productSubtotalOpt = allProductSubtotalService.getProductSubtotalByDealerId(dealerId);

        AllProductSubtotal productSubtotal;
        if (productSubtotalOpt.isPresent()) {
            productSubtotal = productSubtotalOpt.get();
            productSubtotal.setTotalProductSubtotal(productSubtotal.getTotalProductSubtotal() + newOrderSubtotal);  // Add the new subtotal
        } else {
            // Create new AllProductSubtotal entry if not present
            productSubtotal = new AllProductSubtotal(dealerId, newOrderSubtotal);
        }

        allProductSubtotalService.saveOrUpdateProductSubtotal(productSubtotal);  // Save the updated subtotal
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

    public ResponseEntity<String> assignCollector(String[] orderids, String collectorid) {
        Employee employee = employeeRepository.findById(collectorid).orElseThrow();

        for (String orderId : orderids) {
            Order order = orderRepository.findById(orderId).orElseThrow();

            if (order.getCollector() != null) {
                Employee prevEmployee = order.getCollector();
                prevEmployee.getOrderids().remove(order.getOrderid());
                employeeRepository.save(prevEmployee);
            }

            order.setCollector(employee);
            orderRepository.save(order);

            employee.getOrderids().add(order.getOrderid());
        }

        employeeRepository.save(employee);
        return new ResponseEntity<>("Collector assigned successfully", HttpStatus.OK);
    }

    public ResponseEntity<String> removeCollector(String orderid) {
        Order order = orderRepository.findById(orderid).orElseThrow();
        Employee employee = employeeRepository.findById(order.getCollector().getEmployeeid()).orElseThrow();

        employee.getOrderids().remove(orderid);
        employeeRepository.save(employee);

        order.setCollector(null);
        orderRepository.save(order);

        return new ResponseEntity<>("Collector removed successfully", HttpStatus.OK);
    }

    public ResponseEntity<String> updateOrder(String orderId, Order updatedOrder) {
        Order optionalOrder = orderRepository.findById(orderId).orElseThrow();

        optionalOrder.setPenaltyrate(updatedOrder.getPenaltyrate());
        optionalOrder.setDistributiondate(updatedOrder.getDistributiondate());
        optionalOrder.setPaymentterms(updatedOrder.getPaymentterms());
        optionalOrder.setOrderedproducts(updatedOrder.getOrderedproducts());
        optionalOrder.setOrderamount(updatedOrder.getOrderamount());
        optionalOrder.setConfirmed(updatedOrder.getConfirmed());
        optionalOrder.setIsclosed(updatedOrder.isIsclosed());

        for (OrderedProduct op : updatedOrder.getOrderedproducts()) {
            op.setOrderid(updatedOrder.getOrderid());
        }

        orderRepository.save(optionalOrder);

        return new ResponseEntity<>("Order updated successfully", HttpStatus.OK);
    }

    @Scheduled(cron = "0 0 0 */15 * ?")
    public void applyPenaltyForAllLatePayments() {
        LocalDate currentDate = LocalDate.now();
        List<Order> orders = orderRepository.findAll();
        // Implement penalty logic here
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
        return exists ? orderRepository.findById(orderid).orElse(null) : null;
    }

    public Double getTotalOrderedProductsSubtotalByDealerId(String dealerid) {
        Double totalSubtotal = orderRepository.sumOrderedProductsSubtotalByDealerId(dealerid);
        return totalSubtotal != null ? totalSubtotal : 0.0;
    }



}
