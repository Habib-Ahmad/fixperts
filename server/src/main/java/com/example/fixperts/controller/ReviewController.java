package com.example.fixperts.controller;

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
    public ResponseEntity<Review> createReviewForBooking(
            @AuthenticationPrincipal User user,
            @PathVariable String bookingId,
            @RequestBody Review reviewRequest
    ) {
        Booking booking = bookingService.getById(bookingId);

        // Ensure the booking belongs to the user
        if (!booking.getCustomerId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        // Ensure the booking is completed
        if (booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            return ResponseEntity.badRequest().body(null); // or return a meaningful error message
        }

        // Fill in review fields from booking info
        reviewRequest.setBookingId(bookingId);
        reviewRequest.setCustomerId(user.getId());
        reviewRequest.setServiceId(booking.getServiceId());
        Review saved = reviewService.createReview(reviewRequest);

        return ResponseEntity.ok(saved);
    }
    // Get all reviews for a service
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Review>> getByService(@PathVariable String serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsForService(serviceId));
    }
}
