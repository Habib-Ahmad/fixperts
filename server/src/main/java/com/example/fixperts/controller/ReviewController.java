package com.example.fixperts.controller;

import com.example.fixperts.dto.ReviewCreateRequest;
import com.example.fixperts.model.Booking;
import com.example.fixperts.model.Review;
import com.example.fixperts.model.User;
import com.example.fixperts.service.BookingService;
import com.example.fixperts.service.ReviewService;
import com.example.fixperts.service.ServiceService;
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

    // Create review (only customer, only after booking)
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{bookingId}")
    public ResponseEntity<Review> create(
            @AuthenticationPrincipal com.example.fixperts.model.User user,
            @PathVariable String bookingId,
            @RequestBody ReviewCreateRequest request
    ) {
        Booking booking = bookingService.getById(bookingId);

        if (!booking.getCustomerId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        if (booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            return ResponseEntity.badRequest().build();
        }

        Review review = new Review();
        review.setCustomerId(user.getId());
        review.setBookingId(bookingId);
        review.setServiceId(booking.getServiceId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());

        Review saved = reviewService.createReview(review);
        return ResponseEntity.ok(saved);
    }
    // Get all reviews for a service
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Review>> getByService(@PathVariable String serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsForService(serviceId));
    }

    //delete a review if the user is the owner of the review
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @AuthenticationPrincipal com.example.fixperts.model.User user,
            @PathVariable String id
    ) {
        Review review = reviewService.getById(id);
        if (review == null) {
            return ResponseEntity.notFound().build();
        }
        if (!review.getCustomerId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
