package com.example.fixperts.repository;

import com.example.fixperts.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByServiceId(String serviceId);
    Optional<Review> findByBookingId(String bookingId); // To prevent duplicate review for same booking
}
