package com.example.fixperts.controller;

import com.example.fixperts.model.Service;
import com.example.fixperts.service.ServiceService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {
    private final ServiceService svc;

    public ServiceController(ServiceService svc) {
        this.svc = svc;
    }

    @GetMapping
    public ResponseEntity<List<Service>> list(
            @RequestParam(required = false) String q
    ) {
        List<Service> results = (q == null)
                ? svc.getAll()
                : svc.basicSearch(q);
        return ResponseEntity.ok(results);
    }

    // advanced search
    @GetMapping("/search/advanced")
    public ResponseEntity<List<Service>> advanced(
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean emergency,
            @RequestParam(required = false) String category
    ) {
        List<Service> results = svc.advancedSearch(minPrice, maxPrice, emergency, category);
        return ResponseEntity.ok(results);
    }

    // Get specific service
    @GetMapping("/{id}")
    public ResponseEntity<Service> getOne(@PathVariable String id) {
        return ResponseEntity.ok(svc.getById(id));
    }

    // Create new (SERVICE_PROVIDER only)
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<Service> create(
            @AuthenticationPrincipal com.example.fixperts.model.User user,
            @RequestBody Service service
    ) {
        service.setProviderId(user.getId());
        return ResponseEntity.ok(svc.create(service));
    }

    // Update existing
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<Service> update(
            @AuthenticationPrincipal com.example.fixperts.model.User user,
            @PathVariable String id,
            @RequestBody Service service
    ) {
        Service existing = svc.getById(id);
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
        Service existing = svc.getById(id);
        if (!existing.getProviderId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        svc.delete(id);
        return ResponseEntity.noContent().build();
    }
}