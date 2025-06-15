package com.example.fixperts.controller;

import com.example.fixperts.dto.ReviewCreateRequest;
import com.example.fixperts.model.Booking;
import com.example.fixperts.model.Review;
import com.example.fixperts.model.User;
import com.example.fixperts.service.BookingService;
import com.example.fixperts.service.ReviewService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final BookingService bookingService;
    private final ReviewService reviewService;

    public ReviewController(BookingService bookingService, ReviewService reviewService) {
        this.bookingService = bookingService;
        this.reviewService = reviewService;
    }

    /**
     * Create a review (by customer or provider) after booking is completed.
     */
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{bookingId}")
    public ResponseEntity<Review> createReview(
            @AuthenticationPrincipal User user,
            @PathVariable String bookingId,
            @RequestBody ReviewCreateRequest request
    ) {
        Booking booking = bookingService.getById(bookingId);

        if (booking == null || booking.getStatus() != Booking.BookingStatus.PAID) {
            return ResponseEntity.badRequest().build();
        }

        Review review = new Review();
        review.setBookingId(bookingId);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());
        review.setAuthorId(user.getId());

        if (user.getId().equals(booking.getCustomerId())) {
            // Customer reviewing provider/service
            review.setTargetId(booking.getServiceId());
            review.setTargetType("SERVICE");
        } else if (user.getId().equals(booking.getProviderId())) {
            // Provider reviewing customer
            review.setTargetId(booking.getCustomerId());
            review.setTargetType("CLIENT");
        } else {
            return ResponseEntity.status(403).build(); // Neither party in booking
        }

        Review saved = reviewService.createReview(review);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/by-booking-and-author")
    public ResponseEntity<Review> getByBookingAndAuthor(
            @RequestParam String bookingId,
            @RequestParam String authorId
    ) {
        return reviewService.getByBookingAndAuthor(bookingId, authorId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all reviews for a specific service.
     */
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Review>> getReviewsByService(@PathVariable String serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsForService(serviceId));
    }

    /**
     * Get all reviews written about a specific client (by providers).
     */
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Review>> getReviewsByClient(@PathVariable String clientId) {
        return ResponseEntity.ok(reviewService.getReviewsForClient(clientId));
    }

    /**
     * Delete a review (only if the user is the author).
     */
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @AuthenticationPrincipal User user,
            @PathVariable String id
    ) {
        Review review = reviewService.getById(id);
        if (review == null) {
            return ResponseEntity.notFound().build();
        }
        if (!review.getAuthorId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

}
