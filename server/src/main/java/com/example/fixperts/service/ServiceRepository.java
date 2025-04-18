package com.example.fixperts.service;

import com.example.fixperts.service.Service;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface ServiceRepository extends MongoRepository<Service, String> {
    // basic text search on name or description (case-insensitive)
    List<Service> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

    // filter by category
    List<Service> findByCategoryIgnoreCase(String category);

    // find within price range
    List<Service> findByPriceBetween(double min, double max);

    // find emergency services
    List<Service> findByEmergencyAvailableTrue();

    // combine price & emergency
    @Query("{ 'price': { $gte: ?0, $lte: ?1 }, 'emergencyAvailable': ?2 }")
    List<Service> findByPriceBetweenAndEmergency(double min, double max, boolean emergency);
}