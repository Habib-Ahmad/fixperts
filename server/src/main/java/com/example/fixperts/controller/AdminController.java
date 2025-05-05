package com.example.fixperts.controller;

import com.example.fixperts.model.User;
import com.example.fixperts.service.AdminService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<Void> deleteUser(@PathVariable String id, @AuthenticationPrincipal User admin) {
        if (admin.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).build(); // Forbidden if not an admin
        }
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }



}
