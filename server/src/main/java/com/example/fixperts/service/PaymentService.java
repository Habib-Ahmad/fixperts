package com.example.fixperts.service;

import com.example.fixperts.model.Booking;
import com.example.fixperts.model.Payment;
import com.example.fixperts.repository.BookingRepository;
import com.example.fixperts.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    public Payment processFakePayment(String bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getCustomerId().equals(userId)) {
            throw new RuntimeException("Only the customer can pay for this booking.");
        }

        // Fake "payment" logic
        Payment payment = new Payment();
        payment.setBookingId(bookingId);
        payment.setUserId(userId);
        payment.setAmount(booking.getPrice());
        payment.setStatus(Payment.PaymentStatus.PAID);
        payment.setTimestamp(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    public Payment getPaymentByBooking(String bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for this booking"));
    }
}
