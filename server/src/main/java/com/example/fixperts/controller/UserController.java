package com.example.fixperts.controller;

import com.example.fixperts.dto.DeleteAccountRequest;
import com.example.fixperts.dto.UpdateProfileRequest;
import com.example.fixperts.dto.UserProfileResponse;
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
        int servicesProvided = userService.countServicesProvidedByUser(user);
        int validBookings = userService.countValidBookingsByUser(user);

        UserProfileResponse response = new UserProfileResponse(user, servicesProvided, validBookings);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/nearby")
    public ResponseEntity<?> findNearbyUsersWithServices(@RequestParam double latitude,
                                                         @RequestParam double longitude,
                                                         @RequestParam(defaultValue = "10") double distanceKm) {
        Point location = new Point(longitude, latitude);
        Distance distance = new Distance(distanceKm, Metrics.KILOMETERS);

        // Get nearby users with at least one service
        List<User> users = userService.getNearbyUsersWithServices(location, distance);
        return ResponseEntity.ok(users);
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
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        User user = userService.getById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
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

    // Get bookings for the current user
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me/bookings")
    public ResponseEntity<List<Booking>> getBookings(@AuthenticationPrincipal User user) {
        if ( user.getRole().equals("USER")) {
            return ResponseEntity.status(403).body(null); // Forbidden if not admin
        }
        List<Booking> bookings = userService.getBookings(user.getId());
        return ResponseEntity.ok(bookings);
    }
    // Get bookings for a specific user
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{userId}/bookings")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable String userId) {
        //needs to be admin to access this endpoint
        // q: can you check that role is admin ?

        List<Booking> bookings = userService.getBookings(userId);
        return ResponseEntity.ok(bookings);
    }



    // Upload profile picture
    @PostMapping(value = "/me/upload-profile-picture", consumes = "multipart/form-data")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> uploadProfile(@AuthenticationPrincipal User user,
                                           @RequestParam("file") MultipartFile file) {
        String imageUrl = userService.uploadProfilePicture(user, file);
        return ResponseEntity.ok(Map.of("profilePictureUrl", imageUrl));
    }

    // Remove profile picture
    @PostMapping("/me/remove-profile-picture")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> removeProfilePicture(@AuthenticationPrincipal User user) {
        boolean removed = userService.removeProfilePicture(user);
        if (!removed) {
            return ResponseEntity.badRequest().body("No profile picture to remove.");
        }
        return ResponseEntity.ok(Map.of("message", "Profile picture removed."));
    }






}
