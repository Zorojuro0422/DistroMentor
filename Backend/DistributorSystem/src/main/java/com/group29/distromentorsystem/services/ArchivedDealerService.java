package com.group29.distromentorsystem.services;

import com.group29.distromentorsystem.repositories.ArchivedDealerRepository;
import com.group29.distromentorsystem.models.ArchivedDealer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

import java.util.List;

@Service
public class ArchivedDealerService {

    @Autowired
    ArchivedDealerRepository archivedDealerRepository;

    public List<ArchivedDealer> getAllArchivedDealer(){
        return archivedDealerRepository.findAll();
    }

    public List<ArchivedDealer> getAllArchivedDealersByDistributorID(String distributorid) {
        return archivedDealerRepository.findAllByDistributor_Distributorid(distributorid);
    }

    public void deleteArchivedDealerById(String dealerId) {
        Optional<ArchivedDealer> archivedDealer = archivedDealerRepository.findById(dealerId);
        if (archivedDealer.isPresent()) {
            archivedDealerRepository.deleteById(dealerId);
            System.out.println("Archived dealer with ID " + dealerId + " deleted successfully.");
        } else {
            throw new IllegalArgumentException("Archived dealer with ID " + dealerId + " does not exist.");
        }
    }
}
