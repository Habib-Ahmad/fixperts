package com.example.fixperts.service;

import com.example.fixperts.model.Review;
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
        if (reviewRepository.findByBookingId(review.getBookingId()).isPresent()) {
            throw new IllegalStateException("Review already exists for this booking.");
        }

        Review saved = reviewRepository.save(review);
        updateServiceRating(review.getServiceId());
        return saved;
    }

    public List<Review> getReviewsForService(String serviceId) {
        return reviewRepository.findByServiceId(serviceId);
    }

    private void updateServiceRating(String serviceId) {
        List<Review> reviews = reviewRepository.findByServiceId(serviceId);
        double average = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        com.example.fixperts.model.Service service = serviceService.getById(serviceId);
        service.setAverageRating(average);
        serviceService.update(service.getId(), service);
    }
}
