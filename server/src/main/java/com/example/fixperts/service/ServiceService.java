package com.example.fixperts.service;

import com.example.fixperts.repository.ServiceRepository;
import org.springframework.stereotype.Service;
import com.example.fixperts.model.ServiceModel;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ServiceService {
    private final ServiceRepository repo;
    private final FileStorageService fileStorageService;

    public ServiceService(ServiceRepository repo, FileStorageService fileStorageService) {
        this.repo = repo;
        this.fileStorageService = fileStorageService;
    }

    public List<ServiceModel> getAll() {
        return repo.findAll();
    }

    public ServiceModel getById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found: " + id));
    }

    public ServiceModel create(ServiceModel svc) {
        return repo.save(svc);
    }

    public ServiceModel update(String id, ServiceModel updated) {
        ServiceModel existing = getById(id);
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

    public List<ServiceModel> basicSearch(String query) {
        return repo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    public List<ServiceModel> advancedSearch(
            String query,
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
        if (query != null) {
            return repo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
        }
        return getAll();
    }

    public List<ServiceModel> getByProvider(String providerId) {
        return repo.findByProviderId(providerId);
    }

    public List<String> uploadServiceMedia(String serviceId, List<MultipartFile> files) {
        try {
            // Store the service media files and get the URLs
            List<String> mediaUrls = fileStorageService.storeServiceImages(files, serviceId);

            // Retrieve the service object
            ServiceModel service = (ServiceModel) repo.findById(serviceId)
                    .orElseThrow(() -> new RuntimeException("Service not found: " + serviceId));

            // Set the media URLs for the service
            service.setMediaUrls(mediaUrls);

            // Save the updated service object with the media URLs
            repo.save(service);

            return mediaUrls;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store service media files", e);
        }
    }

    public List<ServiceModel> getUnvalidatedServices() {
        return repo.findByValidatedFalse();
    }

}