package com.example.fixperts.controller;

import com.example.fixperts.model.Payment;
import com.example.fixperts.model.User;
import com.example.fixperts.service.PaymentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{bookingId}")
    public ResponseEntity<?> pay(@AuthenticationPrincipal User user,
                                 @PathVariable String bookingId) {
        Payment payment = paymentService.processFakePayment(bookingId, user.getId());
        return ResponseEntity.ok(payment);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getPayment(@PathVariable String bookingId) {
        Payment payment = paymentService.getPaymentByBooking(bookingId);
        return ResponseEntity.ok(payment);
    }
}
