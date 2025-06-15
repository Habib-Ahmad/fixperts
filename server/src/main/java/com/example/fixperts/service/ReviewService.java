package com.example.fixperts.service;

import com.example.fixperts.model.Review;
import com.example.fixperts.model.ServiceModel;
import com.example.fixperts.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ServiceService serviceService;

    public ReviewService(ReviewRepository reviewRepository, ServiceService serviceService) {
        this.reviewRepository = reviewRepository;
        this.serviceService = serviceService;
    }

    public Review createReview(Review review) {
        // Ensure one review per booking per author
        if (reviewRepository.findByBookingIdAndAuthorId(review.getBookingId(), review.getAuthorId()).isPresent()) {
            throw new IllegalStateException("You have already submitted a review for this booking.");
        }

        Review saved = reviewRepository.save(review);

        // Update service rating if the review is for a service
        if ("SERVICE".equals(review.getTargetType())) {
            updateServiceRating(review.getTargetId());
        }

        return saved;
    }

    public void deleteReview(String id) {
        reviewRepository.deleteById(id);
    }

    public List<Review> getReviewsForService(String serviceId) {
        return reviewRepository.findByTargetIdAndTargetType(serviceId, "SERVICE");
    }

    public List<Review> getReviewsForClient(String clientId) {
        return reviewRepository.findByTargetIdAndTargetType(clientId, "CLIENT");
    }

    private void updateServiceRating(String serviceId) {
        List<Review> reviews = reviewRepository.findByTargetIdAndTargetType(serviceId, "SERVICE");
        double average = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);

        ServiceModel service = serviceService.getById(serviceId);
        service.setAverageRating(average);
        serviceService.update(service.getId(), service);
    }

    public Review getById(String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }
    public Optional<Review> getByBookingAndAuthor(String bookingId, String authorId) {
        return reviewRepository.findByBookingIdAndAuthorId(bookingId, authorId);
    }

}
