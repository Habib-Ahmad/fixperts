package com.example.fixperts.service;

import com.example.fixperts.model.Booking;
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

}
