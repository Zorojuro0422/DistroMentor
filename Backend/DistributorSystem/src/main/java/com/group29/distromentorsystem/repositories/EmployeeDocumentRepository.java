package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.EmployeeDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface EmployeeDocumentRepository extends MongoRepository <EmployeeDocument, String> {

    Iterable<EmployeeDocument> findByEmployee_Employeeid(String employeeid);

}
