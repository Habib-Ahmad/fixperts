package com.example.fixperts.user;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
