package com.example.fixperts.controller;

import com.example.fixperts.dto.CreateBookingRequest;
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

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{serviceId}/book")
    public ResponseEntity<Booking> createBooking(
            @AuthenticationPrincipal User user,
            @PathVariable String serviceId,
            @RequestBody CreateBookingRequest request
    ) {
        ServiceModel svc = serviceService.getById(serviceId);

        Booking booking = new Booking();
        booking.setCustomerId(user.getId());
        booking.setServiceId(serviceId);
        booking.setProviderId(svc.getProviderId());

        // 👇 Use price from request
        booking.setPrice(request.getPrice());
        booking.setServiceName(svc.getName());
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setBookingDate(request.getBookingDate());
        booking.setDescription(request.getDescription());

        return ResponseEntity.ok(bookingService.create(booking));
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
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestParam Booking.BookingStatus status
    ) {
        Booking updated = bookingService.updateStatus(id, status, user.getId(), user.getRole());
        return ResponseEntity.ok(updated);

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
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{bookingId}/quote")
    public ResponseEntity<Booking> sendQuote(
            @AuthenticationPrincipal User user,
            @PathVariable String bookingId,
            @RequestParam double price
    ) {
        Booking quoted = bookingService.sendQuote(bookingId, user.getId(), price);
        return ResponseEntity.ok(quoted);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{bookingId}/pay")
    public ResponseEntity<Booking> pay(
            @AuthenticationPrincipal User user,
            @PathVariable String bookingId
    ) {
        Booking paid = bookingService.updateStatus(bookingId, Booking.BookingStatus.PAID, user.getId(), user.getRole());
        return ResponseEntity.ok(paid);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id, @AuthenticationPrincipal User requester) {
        Booking booking = bookingService.getById(id);

        // Allow access only if:
        // - Admin
        // - or booking belongs to this customer or provider
        if (!requester.getRole().equals(User.Role.ADMIN) &&
                !booking.getCustomerId().equals(requester.getId()) &&
                !booking.getProviderId().equals(requester.getId())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(booking);
    }



}
