package com.example.fixperts.controller;

import com.example.fixperts.dto.DeleteAccountRequest;
import com.example.fixperts.dto.UpdateProfileRequest;
import com.example.fixperts.model.Booking;
import com.example.fixperts.model.User;
import com.example.fixperts.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @GetMapping("/providers/nearby")
    public ResponseEntity<?> findNearbyProviders(@RequestParam double latitude,
                                                 @RequestParam double longitude,
                                                 @RequestParam(defaultValue = "10") double distanceKm) {
        Point location = new Point(longitude, latitude);
        Distance distance = new Distance(distanceKm, Metrics.KILOMETERS);

        List<User> providers = userService.getNearbyServiceProviders(location, distance);
        return ResponseEntity.ok(providers);
    }
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateProfileRequest request
    ) {
        try {
            User updated = userService.updateProfile(user, request.getFirstName(), request.getLastName(),
                    request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal User user,
                                           @RequestBody DeleteAccountRequest request) {
        boolean deleted = userService.deleteAccount(user, request.getPassword());

        if (!deleted) {
            return ResponseEntity.status(403).body("Incorrect password.");
        }

        return ResponseEntity.ok("Account deleted successfully.");

    }
    @PostMapping("/me/upload-profile")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> uploadProfile(@AuthenticationPrincipal User user,
                                           @RequestParam("file") MultipartFile file) {
        String imageUrl = userService.uploadProfilePicture(user, file);
        return ResponseEntity.ok(Map.of("profilePictureUrl", imageUrl));
    }





}
