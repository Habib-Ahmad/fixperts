package com.example.fixperts.service;

import com.example.fixperts.model.Booking;
import com.example.fixperts.model.Review;
import com.example.fixperts.model.ServiceModel;
import com.example.fixperts.model.User;
import com.example.fixperts.repository.BookingRepository;
import com.example.fixperts.repository.ReviewRepository;
import com.example.fixperts.repository.ServiceRepository;
import com.example.fixperts.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;

    public AdminService(UserRepository userRepository, ServiceRepository serviceRepository, ReviewRepository reviewRepository,
                        BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(String id, User updatedUser) {
        User existingUser = getUserById(id);
        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPassword(updatedUser.getPassword());
        existingUser.setRole(updatedUser.getRole());
        return userRepository.save(existingUser);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public User demoteToUser(String id) {
        User user = getUserById(id);
        user.setRole(User.Role.USER);
        return userRepository.save(user);
    }

    public void banUser(String id) {
        User user = getUserById(id);
        user.setIsBanned(true);
        userRepository.save(user);
    }

    public List<ServiceModel> getAllUnvalidatedServices() {
        return serviceRepository.findByValidatedFalse();
    }

    public void approveService(String serviceId) {
        ServiceModel svc = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found: " + serviceId));
        svc.setValidated(true);
        serviceRepository.save(svc);
    }

    public void rejectService(String serviceId) {
        // choice A: simply delete
        serviceRepository.deleteById(serviceId);

        // choice B: mark as rejected (you’d need a 'rejected' flag or status field
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public void deleteReview(String reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    public Map<String, Object> getPlatformOverviewStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("bannedUsers", userRepository.countByIsBannedTrue());

        stats.put("totalServices", serviceRepository.count());
        stats.put("validatedServices", serviceRepository.countByValidatedTrue());

        stats.put("totalBookings", bookingRepository.count());

        return stats;
    }

    public Map<String, Long> getBookingCountPerDay(int days) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1);

        List<Booking> bookings = bookingRepository.findByBookingDateBetween(
                startDate.atStartOfDay(), today.plusDays(1).atStartOfDay()
        );

        Map<String, Long> counts = bookings.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getBookingDate().toString(),
                        TreeMap::new, // keeps dates in order
                        Collectors.counting()
                ));

        // Fill missing days with 0
        for (int i = 0; i < days; i++) {
            String date = startDate.plusDays(i).toString();
            counts.putIfAbsent(date, 0L);
        }

        return counts;
    }


}
