package com.example.fixperts.service;

import com.example.fixperts.model.Booking;
import com.example.fixperts.model.User;
import com.example.fixperts.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepo;

    public BookingService(BookingRepository bookingRepo) {
        this.bookingRepo = bookingRepo;
    }

    public Booking create(Booking booking) {
        // You can add more logic here if needed (e.g., validation for description)
        return bookingRepo.save(booking);
    }

    public List<Booking> getByCustomer(String customerId) {
        return bookingRepo.findByCustomerId(customerId);
    }

    public List<Booking> getByProvider(String providerId) {
        return bookingRepo.findByProviderId(providerId);
    }

    public Booking updateStatus(String id, Booking.BookingStatus status) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        return bookingRepo.save(booking);
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

        switch (newStatus) {
            case CONFIRMED:
                if (!isProvider)
                    throw new RuntimeException("Only the provider can confirm the booking.");
                if (booking.getStatus() != Booking.BookingStatus.PENDING)
                    throw new RuntimeException("Only pending bookings can be confirmed.");
                break;

            case REJECTED:
                if (!isProvider)
                    throw new RuntimeException("Only the provider can reject the booking.");
                if (booking.getStatus() != Booking.BookingStatus.PENDING)
                    throw new RuntimeException("Only pending bookings can be rejected.");
                break;

            case PAID:
                if (!isCustomer)
                    throw new RuntimeException("Only the customer can mark the booking as paid.");
                if (booking.getStatus() != Booking.BookingStatus.CONFIRMED)
                    throw new RuntimeException("Only confirmed bookings can be paid.");
                break;

            case COMPLETED:
                if (!isCustomer)
                    throw new RuntimeException("Only the customer can complete the booking.");
                if (booking.getStatus() != Booking.BookingStatus.PAID)
                    throw new RuntimeException("Only paid bookings can be completed.");
                break;

            case CANCELLED:
                if (!isCustomer && !isProvider)
                    throw new RuntimeException("Only the provider or customer can cancel the booking.");
                if (!(booking.getStatus() == Booking.BookingStatus.PENDING || booking.getStatus() == Booking.BookingStatus.CONFIRMED))
                    throw new RuntimeException("Only pending or confirmed bookings can be cancelled.");
                break;

            default:
                throw new RuntimeException("Invalid or unauthorized status transition.");
        }

        booking.setStatus(newStatus);
        return bookingRepo.save(booking);
    }

}
