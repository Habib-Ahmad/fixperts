package com.example.fixperts.service;

import com.example.fixperts.repository.ServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceService {
    private final ServiceRepository repo;

    public ServiceService(ServiceRepository repo) {
        this.repo = repo;
    }

    public List<com.example.fixperts.model.Service> getAll() {
        return repo.findAll();
    }

    public com.example.fixperts.model.Service getById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found: " + id));
    }

    public com.example.fixperts.model.Service create(com.example.fixperts.model.Service svc) {
        return repo.save(svc);
    }

    public com.example.fixperts.model.Service update(String id, com.example.fixperts.model.Service updated) {
        com.example.fixperts.model.Service existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setCategory(updated.getCategory());
        existing.setEmergencyAvailable(updated.isEmergencyAvailable());
        return repo.save(existing);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }

    public List<com.example.fixperts.model.Service> basicSearch(String query) {
        return repo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    public List<com.example.fixperts.model.Service> advancedSearch(
            Double minPrice, Double maxPrice,
            Boolean emergency,
            String category
    ) {
        if (minPrice != null && maxPrice != null && emergency != null) {
            return repo.findByPriceBetweenAndEmergency(minPrice, maxPrice, emergency);
        }
        if (minPrice != null && maxPrice != null) {
            return repo.findByPriceBetween(minPrice, maxPrice);
        }
        if (emergency != null && emergency) {
            return repo.findByEmergencyAvailableTrue();
        }
        if (category != null) {
            return repo.findByCategoryIgnoreCase(category);
        }
        return getAll();
    }
}