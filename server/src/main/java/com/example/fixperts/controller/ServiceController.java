package com.example.fixperts.controller;

import com.example.fixperts.dto.CreateServiceRequest;
import com.example.fixperts.dto.UpdateServiceRequest;
import com.example.fixperts.model.ServiceModel;
import com.example.fixperts.model.User;
import com.example.fixperts.service.ServiceService;
import com.example.fixperts.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {
    private final ServiceService svc;
    private final UserService userService;

    public ServiceController(ServiceService svc, UserService userService) {
        this.svc = svc;
        this.userService = userService;
    }


    @GetMapping
    public ResponseEntity<List<ServiceModel>> list(
            @RequestParam(required = false) String q
    ) {
        List<ServiceModel> results = (q == null)
                ? svc.getAll()
                : svc.basicSearch(q);
        return ResponseEntity.ok(results);
    }

    // advanced search
    @GetMapping("/search/advanced")
    public ResponseEntity<List<ServiceModel>> advanced(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean emergency,
            @RequestParam(required = false) ServiceModel.ServiceCategory category  // enum type here
    ) {
        List<ServiceModel> results = svc.advancedSearch(query, minPrice, maxPrice, emergency, category);
        return ResponseEntity.ok(results);
    }

    // Get specific service
    @GetMapping("/{id}")
    public ResponseEntity<ServiceModel> getOne(@PathVariable String id) {
        return ResponseEntity.ok(svc.getById(id));
    }

    @PostMapping("")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ServiceModel> create(
            @AuthenticationPrincipal com.example.fixperts.model.User user,
            @RequestBody CreateServiceRequest request
    ) {
        ServiceModel service = new ServiceModel();
        service.setProviderId(user.getId());
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setCategory(request.getCategory());
        service.setEmergencyAvailable(request.isEmergencyAvailable());
        // No file handling here
        ServiceModel created = svc.create(service);
        return ResponseEntity.ok(created);
    }

    // Update existing
    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ServiceModel> update(
            @PathVariable String id,
            @RequestBody UpdateServiceRequest request
    ) {
        ServiceModel existing = svc.getById(id);

        // Update core fields only
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setPrice(request.getPrice());
        existing.setCategory(request.getCategory());
        existing.setEmergencyAvailable(request.isEmergencyAvailable());

        // No media add/remove handling here

        ServiceModel updated = svc.update(id, existing);
        return ResponseEntity.ok(updated);
    }

    // Delete
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal com.example.fixperts.model.User user,
            @PathVariable String id
    ) {
        ServiceModel existing = svc.getById(id);
        if (!existing.getProviderId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        svc.delete(id);
        return ResponseEntity.noContent().build();
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ServiceModel>> getByProviderId(@PathVariable String providerId) {
        return ResponseEntity.ok(svc.getByProvider(providerId));
    }



    @SecurityRequirement(name = "bearerAuth")
    @PostMapping(value = "/{serviceId}/upload-media", consumes = {"multipart/form-data"})
    public ResponseEntity<?> uploadServiceMedia(
            @AuthenticationPrincipal User user,
            @PathVariable String serviceId,
            @RequestParam("files") List<MultipartFile> files) {

        ServiceModel service = svc.getById(serviceId);

        // Check if authenticated user is the service provider
        if (!service.getProviderId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You are not the provider of this service.");
        }

        List<String> imageUrls = svc.uploadServiceMedia(serviceId, files);
        // Update service mediaUrls
        List<String> allMediaUrls = new ArrayList<>(service.getMediaUrls());
        allMediaUrls.addAll(imageUrls);
        service.setMediaUrls(allMediaUrls);
        svc.update(serviceId, service);

        return ResponseEntity.ok(Map.of("mediaUrls", imageUrls));
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{serviceId}/remove-media")
    public ResponseEntity<?> removeServiceMedia(
            @AuthenticationPrincipal User user,
            @PathVariable String serviceId,
            @RequestBody List<String> mediaUrlsToRemove) {

        ServiceModel service = svc.getById(serviceId);

        // Check if authenticated user is the service provider
        if (!service.getProviderId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You are not the provider of this service.");
        }

        // Delete files from storage
        svc.deleteServiceMediaFiles(mediaUrlsToRemove);

        // Remove URLs from the service media list
        List<String> updatedUrls = new ArrayList<>(service.getMediaUrls());
        updatedUrls.removeAll(mediaUrlsToRemove);
        service.setMediaUrls(updatedUrls);

        // Save updated service
        svc.update(serviceId, service);

        return ResponseEntity.ok(Map.of("removedMediaUrls", mediaUrlsToRemove));
    }
}
