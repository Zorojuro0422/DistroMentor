package com.group29.distromentorsystem.services;

import com.group29.distromentorsystem.models.Deposit;
import com.group29.distromentorsystem.repositories.DepositRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepositService {

    @Autowired
    private DepositRepository depositRepository;

    // Create a new deposit
    public Deposit createDeposit(Deposit deposit) {
        return depositRepository.save(deposit);
    }

    // Find deposit by ID
    public Optional<Deposit> getDepositById(String depositId) {
        return depositRepository.findById(depositId);
    }

    // Find deposits by dealer ID
    public List<Deposit> getDepositsByDealerId(String dealerId) {
        return depositRepository.findByDealerid(dealerId);
    }

    // Find deposits by distributor ID
    public List<Deposit> getDepositsByDistributorId(String distributorId) {
        return depositRepository.findByDistributorid(distributorId);
    }

    // Get all deposits by status (e.g., pending, accepted, declined)
    public List<Deposit> getDepositsByStatus(String status) {
        return depositRepository.findByStatus(status);
    }

    public List<Deposit> getAllDeposits() {
        return depositRepository.findAll();
    }
}
