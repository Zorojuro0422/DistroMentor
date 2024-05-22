package com.group29.distromentorsystem.controllers;


import com.group29.distromentorsystem.services.DistributorDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/distributorDocument")
public class DistributorDocumentController {

    @Autowired
    DistributorDocumentService distributorDocumentService;



    @GetMapping("/findAllDocumentsByDistributorId/{distributorid}")
    public ResponseEntity<Object> findAllDocumentsByEmployeeId(@PathVariable String distributorid){
        return new ResponseEntity<>(distributorDocumentService.findAllDocumentsByDistributorId(distributorid), HttpStatus.OK);
    }
}
