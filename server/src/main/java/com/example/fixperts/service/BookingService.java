package com.example.fixperts.service;

import com.example.fixperts.model.Booking;
import com.example.fixperts.model.User;
import com.example.fixperts.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepo;

    public BookingService(BookingRepository bookingRepo) {
        this.bookingRepo = bookingRepo;
    }

    public Booking create(Booking booking) {
        booking.setPaymentStatus(Booking.PaymentStatus.PENDING); // Default
        return bookingRepo.save(booking);
    }

    public List<Booking> getByCustomer(String customerId) {
        return bookingRepo.findByCustomerId(customerId);
    }

    public List<Booking> getByProvider(String providerId) {
        return bookingRepo.findByProviderId(providerId);
    }

    public void delete(String id) {
        bookingRepo.deleteById(id);
    }

    public Booking getById(String bookingId) {
        return bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public Booking updateStatus(String bookingId, Booking.BookingStatus newStatus, String requesterId, User.Role role) {
        Booking booking = getById(bookingId);
        boolean isProvider = booking.getProviderId().equals(requesterId);
        boolean isCustomer = booking.getCustomerId().equals(requesterId);
        LocalDate today = LocalDate.now();

        switch (newStatus) {
            case CONFIRMED:
                if (!isProvider) throw new RuntimeException("Only the provider can confirm the booking.");
                if (booking.getStatus() != Booking.BookingStatus.PENDING)
                    throw new RuntimeException("Only pending bookings can be confirmed.");
                break;

            case COMPLETED:
                if (!isCustomer) throw new RuntimeException("Only the customer can mark as completed.");
                if (booking.getStatus() != Booking.BookingStatus.CONFIRMED)
                    throw new RuntimeException("Only confirmed bookings can be completed.");
                if (today.isBefore(booking.getBookingDate())) {
                    throw new RuntimeException("Cannot complete the booking before its scheduled date.");
                }
                break;

            case QUOTED:
                if (!isProvider) throw new RuntimeException("Only the provider can send a quote.");
                if (booking.getStatus() != Booking.BookingStatus.COMPLETED)
                    throw new RuntimeException("Quote can only be sent after completion.");
                break;

            case PAID:
                if (!isCustomer) throw new RuntimeException("Only the customer can pay.");
                if (booking.getStatus() != Booking.BookingStatus.QUOTED)
                    throw new RuntimeException("Must be quoted before payment.");
                break;

            case REJECTED:
                if (!isProvider) throw new RuntimeException("Only the provider can reject.");
                if (booking.getStatus() != Booking.BookingStatus.PENDING)
                    throw new RuntimeException("Only pending bookings can be rejected.");
                break;

            case CANCELLED:
                if (!isCustomer && !isProvider)
                    throw new RuntimeException("Only provider or customer can cancel.");
                if (booking.getStatus() == Booking.BookingStatus.COMPLETED ||
                        booking.getStatus() == Booking.BookingStatus.QUOTED ||
                        booking.getStatus() == Booking.BookingStatus.PAID)
                    throw new RuntimeException("You can only cancel before completion.");
                break;
            case REVIEWED:
                if (!isCustomer) throw new RuntimeException("Only the customer can mark as reviewed.");
                if (booking.getStatus() != Booking.BookingStatus.PAID)
                    throw new RuntimeException("Only paid bookings can be reviewed.");
                break;

            default:
                throw new RuntimeException("Invalid or unauthorized status transition.");
        }

        booking.setStatus(newStatus);
        if (newStatus == Booking.BookingStatus.PAID) {
            booking.setPaymentStatus(Booking.PaymentStatus.PAID);
        }

        return bookingRepo.save(booking);
    }

    public Booking sendQuote(String bookingId, String providerId, double quotedPrice) {
        Booking booking = getById(bookingId);

        if (!booking.getProviderId().equals(providerId)) {
            throw new RuntimeException("Only the provider can send a quote.");
        }
        if (booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Can only quote after completion.");
        }

        booking.setPrice(quotedPrice);
        booking.setStatus(Booking.BookingStatus.QUOTED);
        booking.setPaymentStatus(Booking.PaymentStatus.PENDING);

        return bookingRepo.save(booking);
    }
}
