package com.example.fixperts.controller;

import com.example.fixperts.model.Booking;
import com.example.fixperts.model.ServiceModel;
import com.example.fixperts.model.User;
import com.example.fixperts.service.ServiceService;
import com.example.fixperts.service.BookingService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final ServiceService serviceService;

    public BookingController(BookingService bookingService, ServiceService serviceService) {
        this.bookingService = bookingService;
        this.serviceService = serviceService;
    }

    // Create booking with description
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{serviceId}/book")
    public ResponseEntity<Booking> createBooking(
            @AuthenticationPrincipal User user,
            @PathVariable String serviceId,
            @RequestBody Booking bookingRequest
    ) {
        ServiceModel svc = serviceService.getById(serviceId);

        bookingRequest.setCustomerId(user.getId());
        bookingRequest.setServiceId(serviceId);
        bookingRequest.setProviderId(svc.getProviderId());
        bookingRequest.setPrice(svc.getPrice());
        bookingRequest.setStatus(Booking.BookingStatus.PENDING);

        // Optionally, you could validate the description or other fields here

        return ResponseEntity.ok(bookingService.create(bookingRequest));
    }

    // Get bookings for customer
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/customer")
    public ResponseEntity<List<Booking>> customerBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getByCustomer(user.getId()));
    }

    // Get bookings for provider
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/provider")
    public ResponseEntity<List<Booking>> providerBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getByProvider(user.getId()));
    }

    // Accept/reject booking
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable String id,
            @RequestParam Booking.BookingStatus status
    ) {
        return ResponseEntity.ok(bookingService.updateStatus(id, status));
    }
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> bookingsByCustomerId(@PathVariable String customerId) {
        return ResponseEntity.ok(bookingService.getByCustomer(customerId));
    }

    // Get bookings for a specific provider (by ID)
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Booking>> bookingsByProviderId(@PathVariable String providerId) {
        return ResponseEntity.ok(bookingService.getByProvider(providerId));
    }
    @PutMapping("/{id}/confirm")
    public ResponseEntity<Booking> confirm(@PathVariable String id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.updateStatus(id, Booking.BookingStatus.CONFIRMED, user.getId(), user.getRole()));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Booking> reject(@PathVariable String id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.updateStatus(id, Booking.BookingStatus.REJECTED, user.getId(), user.getRole()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancel(@PathVariable String id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.updateStatus(id, Booking.BookingStatus.CANCELLED, user.getId(), user.getRole()));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Booking> complete(@PathVariable String id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.updateStatus(id, Booking.BookingStatus.COMPLETED, user.getId(), user.getRole()));
    }

}
