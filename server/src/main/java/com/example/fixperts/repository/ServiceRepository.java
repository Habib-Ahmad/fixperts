package com.example.fixperts.repository;

import com.example.fixperts.model.ServiceModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ServiceRepository extends MongoRepository<ServiceModel, String> {
    // basic text search on name or description (case-insensitive)
    List<ServiceModel> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

    // filter by category
    List<ServiceModel> findByCategoryIgnoreCase(String category);

    // find within price range
    List<ServiceModel> findByPriceBetween(double min, double max);

    // find emergency services
    List<ServiceModel> findByEmergencyAvailableTrue();

    List<ServiceModel> findByProviderId(String providerId);

    // get all the services not yet validated by admin
    List<ServiceModel> findByValidatedFalse();

    // combine price & emergency
    @Query("{ 'price': { $gte: ?0, $lte: ?1 }, 'emergencyAvailable': ?2 }")
    List<ServiceModel> findByPriceBetweenAndEmergency(double min, double max, boolean emergency);


}