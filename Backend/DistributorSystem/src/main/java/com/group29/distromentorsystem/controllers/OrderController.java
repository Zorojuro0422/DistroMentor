package com.group29.distromentorsystem.controllers;

import com.group29.distromentorsystem.models.Order;
import com.group29.distromentorsystem.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/order")
public class OrderController {

    @Autowired
    OrderService orderService;

    @PostMapping("/createOrder")
    public ResponseEntity<Object> createOrder(@RequestBody Order order){

        orderService.createOrder(order);

        return new ResponseEntity<>("Order created successfully!", HttpStatus.CREATED);
    }

    @GetMapping("/getAllOrders")
    public ResponseEntity<Object> getAllOrders(){
        return new ResponseEntity<>(orderService.getAllOrders(), HttpStatus.OK);
    }

    @GetMapping("/getOrderByID/{orderid}")
    public ResponseEntity<Object> getOrderByID(@PathVariable String orderid){
        return new ResponseEntity<>(orderService.getOrderByID(orderid), HttpStatus.OK);
    }

    @GetMapping("/getOrderByIDUnderDistributor/{orderid}/{distributorid}")
    public ResponseEntity<Object> getOrderByIDUnderDistributor(@PathVariable String orderid, @PathVariable String distributorid){
        return new ResponseEntity<>(orderService.getOrderByIDUnderDistributor(orderid, distributorid), HttpStatus.OK);
    }



    @GetMapping("/getAllOrdersByDistributorID/{distributorid}")
    public ResponseEntity<Object> getAllOrdersByDistributorID(@PathVariable String distributorid) {
        return new ResponseEntity<>(orderService.getAllOrdersByDistributorID(distributorid), HttpStatus.OK);
    }



   /* @PutMapping("/assignCollector/{orderid}")
    public ResponseEntity<Object> assignCollector(@PathVariable String orderid, @RequestBody Employee collector){
        return new ResponseEntity<>(orderService.assignCollector(orderid, collector), HttpStatus.OK);
    }*/

    @PutMapping("/assignCollector/{collectorid}")
    public ResponseEntity<Object> assignCollector(@PathVariable String  collectorid, @RequestBody  String[] orderids) {
        return orderService.assignCollector(orderids, collectorid);
    }

    @PutMapping("/removeCollector/{orderid}")
    public ResponseEntity<Object> removeCollector(@PathVariable String orderid){
        return new ResponseEntity<>(orderService.removeCollector(orderid), HttpStatus.OK);
    }

    @PutMapping("/updateOrder/{orderId}")
    public ResponseEntity<Object> updateOrder(@PathVariable String orderId, @RequestBody Order updatedOrder) {
        return new ResponseEntity<>(orderService.updateOrder(orderId, updatedOrder), HttpStatus.OK);
    }

/*    @PutMapping("/applyPenalty/{orderId}")
    public ResponseEntity<Object> applyPenalty(@PathVariable String orderId) {
        orderService.applyPenaltyForLatePayments(orderId);
        return new ResponseEntity<>("Penalty applied successfully for order " + orderId, HttpStatus.OK);
    }*/
    @PutMapping("/applyPenaltyForAllLatePayments")
    public ResponseEntity<String> applyPenaltyForAllLatePayments() {
            orderService.applyPenaltyForAllLatePayments();
            return new ResponseEntity<>("Penalties applied successfully", HttpStatus.OK);

    }


    @GetMapping("/getAllUnconfirmedOrders")
    public ResponseEntity<Object> getAllUnconfirmedOrders(){
        return new ResponseEntity<>(orderService.getAllUnconfirmedOrders(), HttpStatus.OK);
    }

    @GetMapping("/getOrderByDealerId/{dealerId}")
    public ResponseEntity<Object> getOrderByDealerId(@PathVariable String dealerId){
        return new ResponseEntity<>(orderService.getOrderByDealerId(dealerId), HttpStatus.OK);
    }

    @GetMapping("/getAllUnconfirmedOrdersByDistributorID/{distributorid}")
    public ResponseEntity<Object> getAllUnconfirmedOrdersByDistributorID(@PathVariable String distributorid){
        return new ResponseEntity<>(orderService.getAllUnconfirmedOrdersByDistributorID(distributorid), HttpStatus.OK);
    }

    // Get all confirmed orders by dealer ID
    @GetMapping("/getAllConfirmedOrdersByDealerId/{dealerId}")
    public ResponseEntity<List<Order>> getAllConfirmedOrdersByDealerId(@PathVariable String dealerId) {
        List<Order> orders = orderService.getAllConfirmedOrdersByDealerId(dealerId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/getTotalOrderedProductsSubtotalByDealerId/{dealerId}")
    public ResponseEntity<Double> getTotalOrderedProductsSubtotalByDealerId(@PathVariable String dealerId) {
        Double totalSubtotal = orderService.getTotalOrderedProductsSubtotalByDealerId(dealerId);
        return new ResponseEntity<>(totalSubtotal, HttpStatus.OK);
    }


}
