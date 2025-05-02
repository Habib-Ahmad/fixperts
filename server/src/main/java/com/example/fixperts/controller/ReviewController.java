package com.example.fixperts.controller;

import com.example.fixperts.model.Review;
import com.example.fixperts.model.User;
import com.example.fixperts.service.ReviewService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Create review (only customer, only after booking)
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<Review> create(
            @AuthenticationPrincipal User user,
            @RequestBody Review review
    ) {
        review.setCustomerId(user.getId());
        return ResponseEntity.ok(reviewService.createReview(review));
    }

    // Get all reviews for a service
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Review>> getByService(@PathVariable String serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsForService(serviceId));
    }
}
