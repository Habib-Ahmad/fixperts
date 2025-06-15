package com.example.fixperts.repository;

import com.example.fixperts.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends MongoRepository<Review, String> {

    // Used to get reviews about a service or a client
    List<Review> findByTargetIdAndTargetType(String targetId, String targetType);

    // Prevent duplicate reviews from the same user for the same booking
    Optional<Review> findByBookingIdAndAuthorId(String bookingId, String authorId);

    // Optional: still allows fetching all reviews (e.g., for admin)
    List<Review> findAll();

    void deleteById(String id);

}
