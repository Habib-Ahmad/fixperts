package com.example.fixperts.controller;

import com.example.fixperts.model.Review;
import com.example.fixperts.model.ServiceModel;
import com.example.fixperts.model.User;
import com.example.fixperts.service.AdminService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@SecurityRequirement(name = "bearerAuth")  // Ensure admin is authenticated
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(@AuthenticationPrincipal User admin) {

        if (admin.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).build(); // Forbidden if not an admin
        }
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id, @AuthenticationPrincipal User admin) {
        if (admin.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).build(); // Forbidden if not an admin
        }
        User user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser, @AuthenticationPrincipal User admin) {
        if (admin.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).build(); // Forbidden if not an admin
        }
        User user = adminService.updateUser(id, updatedUser);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> banUser(@PathVariable String id, @AuthenticationPrincipal User admin) {
        if (admin.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).build(); // Forbidden if not an admin
        }
        adminService.banUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceModel>> getAllUnvalidatedServices(@AuthenticationPrincipal User admin) {
        if (admin.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).build(); // Forbidden if not an admin
        }
        List<ServiceModel> services = adminService.getAllUnvalidatedServices();
        return ResponseEntity.ok(services);
    }

    @PutMapping("/services/{id}/approve")
    public ResponseEntity<Void> approveService(
            @PathVariable String id,
            @AuthenticationPrincipal User admin
    ) {
        if (admin.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).build(); // Forbidden if not an admin
        }
        adminService.approveService(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/services/{id}/reject")
    public ResponseEntity<Void> rejectService(
            @PathVariable String id,
            @AuthenticationPrincipal User admin
    ) {
        if (admin.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).build(); // Forbidden if not an admin
        }
        adminService.rejectService(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> listAllReviews(@AuthenticationPrincipal User admin) {
        if (admin.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).build(); // Forbidden if not an admin
        }
        List<Review> reviews = adminService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable String reviewId, @AuthenticationPrincipal User admin
    ) {
        adminService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats/overview")
    public ResponseEntity<Map<String, Object>> getPlatformOverview(@AuthenticationPrincipal User admin) {
        if (admin.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        Map<String, Object> stats = adminService.getPlatformOverviewStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/bookings-by-day")
    public ResponseEntity<Map<String, Long>> getBookingsByDay(
            @AuthenticationPrincipal User admin,
            @RequestParam(defaultValue = "30") int days
    ) {
        if (admin.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        Map<String, Long> stats = adminService.getBookingCountPerDay(days);
        return ResponseEntity.ok(stats);
    }






}
