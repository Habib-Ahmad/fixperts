package com.example.fixperts.service;

import com.example.fixperts.repository.ServiceRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import com.example.fixperts.model.ServiceModel;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ServiceService {
    private final MongoTemplate mongoTemplate;

    private final ServiceRepository repo;
    private final FileStorageService fileStorageService;

    public ServiceService(MongoTemplate mongoTemplate, ServiceRepository repo, FileStorageService fileStorageService) {
        this.mongoTemplate = mongoTemplate;
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
        existing.setAverageRating(updated.getAverageRating()); // ✅ THIS LINE IS MANDATORY
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
            Double minPrice,
            Double maxPrice,
            Boolean emergency,
            ServiceModel.ServiceCategory category  // enum type here
    ) {
        List<Criteria> criteriaList = new ArrayList<>();

        if (query != null && !query.isEmpty()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("name").regex(query, "i"),
                    Criteria.where("description").regex(query, "i")
            ));
        }

        if (minPrice != null && maxPrice != null) {
            criteriaList.add(Criteria.where("price").gte(minPrice).lte(maxPrice));
        } else if (minPrice != null) {
            criteriaList.add(Criteria.where("price").gte(minPrice));
        } else if (maxPrice != null) {
            criteriaList.add(Criteria.where("price").lte(maxPrice));
        }

        if (emergency == true) {
            criteriaList.add(Criteria.where("emergencyAvailable").is(emergency));
        }

        if (category != null) {
            criteriaList.add(Criteria.where("category").is(category));
        }

        Criteria criteria = new Criteria();
        if (!criteriaList.isEmpty()) {
            criteria = new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
        }

        Query queryObj = new Query(criteria);

        return mongoTemplate.find(queryObj, ServiceModel.class);
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

    public void deleteServiceMediaFiles(List<String> removeMediaUrls) {
        for (String url : removeMediaUrls) {
            fileStorageService.deleteFile(url);
        }
    }
}