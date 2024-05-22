package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.PaymentTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentTransactionRepository extends MongoRepository<PaymentTransaction, String> {

    @Query("{ 'endDate': { $lt: ?0 }, 'isPaid': false }")
    List<PaymentTransaction> findLatePayments(LocalDate currentDate);


}
