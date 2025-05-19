package com.example.fixperts.service;

import com.example.fixperts.model.Review;
import com.example.fixperts.model.ServiceModel;
import com.example.fixperts.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ServiceService serviceService;

    public ReviewService(ReviewRepository reviewRepository, ServiceService serviceService) {
        this.reviewRepository = reviewRepository;
        this.serviceService = serviceService;
    }

    public Review createReview(Review review) {
        if (reviewRepository.findByBookingId(review.getBookingId()).isPresent()) {
            throw new IllegalStateException("Review already exists for this booking.");
        }

        Review saved = reviewRepository.save(review);
        updateServiceRating(review.getServiceId());
        return saved;
    }

    public void deleteReview(String id) {
        reviewRepository.deleteById(id);
    }

    public List<Review> getReviewsForService(String serviceId) {
        return reviewRepository.findByServiceId(serviceId);
    }

    private void updateServiceRating(String serviceId) {
        List<Review> reviews = reviewRepository.findByServiceId(serviceId);
        double average = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        ServiceModel service = serviceService.getById(serviceId);
        service.setAverageRating(average);
        serviceService.update(service.getId(), service);
    }

    public Review getById(String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }
}
