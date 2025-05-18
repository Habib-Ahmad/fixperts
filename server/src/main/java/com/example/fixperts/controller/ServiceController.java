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
            @RequestParam(required = false) String category
    ) {
        List<ServiceModel> results = svc.advancedSearch(query,minPrice, maxPrice, emergency, category);
        return ResponseEntity.ok(results);
    }

    // Get specific service
    @GetMapping( "/{id}")
    public ResponseEntity<ServiceModel> getOne(@PathVariable String id) {
        return ResponseEntity.ok(svc.getById(id));
    }

    // Create new (SERVICE_PROVIDER only)
    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ServiceModel> create(
            @AuthenticationPrincipal com.example.fixperts.model.User user,
            @RequestBody CreateServiceRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files

    ) {
        ServiceModel service = new ServiceModel();
        service.setProviderId(user.getId());
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setCategory(request.getCategory());
        service.setEmergencyAvailable(request.isEmergencyAvailable());
        // Save service first to get ID
        ServiceModel created = svc.create(service);

        if (files != null && !files.isEmpty()) {
            // Upload files and set media URLs
            List<String> mediaUrls = svc.uploadServiceMedia(created.getId(), files);
            created.setMediaUrls(mediaUrls);
            created = svc.update(created.getId(), created);
        }

        return ResponseEntity.ok(created);
    }

    // Update existing
    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ServiceModel> update(
            @PathVariable String id,
            @RequestPart("service") UpdateServiceRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {

        ServiceModel existing = svc.getById(id);

        // Update core fields
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setPrice(request.getPrice());
        existing.setCategory(request.getCategory());
        existing.setEmergencyAvailable(request.isEmergencyAvailable());

        // Handle media removal
        if (request.getRemoveMediaUrls() != null) {
            List<String> updatedUrls = new ArrayList<>(existing.getMediaUrls());
            updatedUrls.removeAll(request.getRemoveMediaUrls());

            //  delete the files from storage as well
            svc.deleteServiceMediaFiles(request.getRemoveMediaUrls());

            existing.setMediaUrls(updatedUrls);
        }

        // Handle media addition
        if (files != null && !files.isEmpty()) {
            List<String> newMediaUrls = svc.uploadServiceMedia(id, files);
            List<String> allMediaUrls = new ArrayList<>(existing.getMediaUrls());
            allMediaUrls.addAll(newMediaUrls);
            existing.setMediaUrls(allMediaUrls);
        }

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
    @PostMapping("/{serviceId}/upload-media")
    public ResponseEntity<?> uploadServiceMedia(
            @PathVariable String serviceId,
            @RequestParam("files") List<MultipartFile> files) {
        List<String> imageUrls = svc.uploadServiceMedia(serviceId, files);
        return ResponseEntity.ok(Map.of("mediaUrls", imageUrls));
    }

}