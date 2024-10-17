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

    // Get all deposits
    public List<Deposit> getAllDeposits() {
        return depositRepository.findAll();
    }

    public List<Deposit> getDepositsByStatus(String status) {
        return depositRepository.findByStatus(status);
    }

    // Delete a deposit by ID
    public void deleteDepositById(String depositId) {
        depositRepository.deleteById(depositId);
    }

    // Update a deposit
    public Deposit updateDeposit(Deposit deposit) {
        return depositRepository.save(deposit);
    }

    // Confirm a deposit
    public Deposit confirmDeposit(String depositId) {
        Optional<Deposit> depositOptional = depositRepository.findById(depositId);
        if (depositOptional.isPresent()) {
            Deposit deposit = depositOptional.get();
            deposit.setStatus("confirmed");
            return depositRepository.save(deposit);
        }
        throw new RuntimeException("Deposit not found");
    }

    // Decline a deposit with a reason
    public Deposit declineDeposit(String depositId, String reason) {
        Optional<Deposit> depositOptional = depositRepository.findById(depositId);
        if (depositOptional.isPresent()) {
            Deposit deposit = depositOptional.get();
            deposit.setStatus("declined");
            deposit.setDeclineReason(reason);
            return depositRepository.save(deposit);
        }
        throw new RuntimeException("Deposit not found");
    }

    public List<Deposit> getDepositsByDealerIdAndStatus(String dealerId, String status) {
        return depositRepository.findByDealeridAndStatus(dealerId, status);
    }

    public List<Deposit> getDepositsByDistributorIdAndStatus(String distributorId, String status) {
        return depositRepository.findByDistributoridAndStatus(distributorId, status);
    }

}
