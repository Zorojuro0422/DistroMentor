package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends MongoRepository<Employee, String> {

    Optional<Employee> findById(String id);

    Employee findByEmployeeidAndPassword(String employeeid, String password);

    List<Employee> findAllByDistributor_Distributorid(String distributorId);

    List<Employee> findByDistributor_DistributoridAndIscollectorTrue(String distributorid);

    Optional<Employee> findByOrderidsContaining(String orderid);

}