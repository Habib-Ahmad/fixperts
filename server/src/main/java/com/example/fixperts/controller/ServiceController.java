package com.example.fixperts.controller;

import com.example.fixperts.model.ServiceModel;
import com.example.fixperts.model.User;
import com.example.fixperts.service.ServiceService;
import com.example.fixperts.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    @GetMapping("/{id}")
    public ResponseEntity<ServiceModel> getOne(@PathVariable String id) {
        return ResponseEntity.ok(svc.getById(id));
    }

    // Create new (SERVICE_PROVIDER only)
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<ServiceModel> create(
            @AuthenticationPrincipal com.example.fixperts.model.User user,
            @RequestBody ServiceModel service
    ) {
        service.setProviderId(user.getId());
        ServiceModel created = svc.create(service);

        // Check if user is not already a SERVICE_PROVIDER
        if (user.getRole() != User.Role.SERVICE_PROVIDER) {
            user.setRole(User.Role.SERVICE_PROVIDER);
            userService.update(user.getId(), user);  // Add this method if not already present
        }

        return ResponseEntity.ok(created);
    }

    // Update existing
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<ServiceModel> update(
            @AuthenticationPrincipal com.example.fixperts.model.User user,
            @PathVariable String id,
            @RequestBody ServiceModel service
    ) {
        ServiceModel existing = svc.getById(id);
        if (!existing.getProviderId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(svc.update(id, service));
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