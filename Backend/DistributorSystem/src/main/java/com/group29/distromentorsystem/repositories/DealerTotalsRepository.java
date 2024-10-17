package com.group29.distromentorsystem.repositories;

import com.group29.distromentorsystem.models.DealerTotals;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DealerTotalsRepository extends MongoRepository<DealerTotals, String> {
    // Optional method to find DealerTotals by dealerid
    Optional<DealerTotals> findByDealerid(String dealerid);
}
