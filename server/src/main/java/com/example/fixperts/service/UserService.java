package com.example.fixperts.service;

import com.example.fixperts.model.Booking;
import com.example.fixperts.model.ServiceModel;
import com.example.fixperts.model.User;
import com.example.fixperts.repository.BookingRepository;
import com.example.fixperts.repository.ServiceRepository;
import com.example.fixperts.repository.UserRepository;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final BookingRepository bookingRepository;
    private final FileStorageService fileStorageService;
    private final ServiceRepository serviceRepository;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, BookingRepository bookingRepository, FileStorageService fileStorageService, ServiceRepository serviceRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.bookingRepository = bookingRepository;
        this.fileStorageService = fileStorageService;
        this.serviceRepository = serviceRepository;
    }
    public User updateProfile(User user, String firstName, String lastName, String oldPassword, String newPassword) {
        if (firstName != null && !firstName.isEmpty()) {
            user.setFirstName(firstName);
        }
        if (lastName != null && !lastName.isEmpty()) {
            user.setLastName(lastName);
        }

        // If password is to be changed, verify the old one
        if (oldPassword != null && newPassword != null &&
                !oldPassword.isEmpty() && !newPassword.isEmpty()) {
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                throw new IllegalArgumentException("Old password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        return userRepository.save(user);
    }
    public boolean deleteAccount(User user, String rawPassword) {
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            return false;
        }

        userRepository.deleteById(user.getId());
        return true;
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }


    public List<User> getNearbyUsersWithServices(Point location, Distance distance) {
    // Step 1: Find all users within the distance
        List<User> nearbyUsers = userRepository.findByLocationNear(location, distance);

    // Step 2: Filter users who have at least one service
    return nearbyUsers.stream()
            .filter(user -> hasAtLeastOneService(user))
            .collect(Collectors.toList());
    }

    private boolean hasAtLeastOneService(User user) {
        List<ServiceModel> services = serviceRepository.findByProviderId(user.getId());

        return !services.isEmpty();
    }
    public List<Booking> getBookings(String id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
        }
        return null;
    }

    public User update(String id, User updatedUser) {
        User existing =    userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        existing.setFirstName(updatedUser.getFirstName());
        existing.setLastName(updatedUser.getLastName());
        existing.setEmail(updatedUser.getEmail());
        existing.setPassword(updatedUser.getPassword());
        existing.setLocation(updatedUser.getLocation());
        existing.setRole(updatedUser.getRole());  // Only this matters here

        return userRepository.save(existing);
    }

    public String uploadProfilePicture(User user, MultipartFile file) {
        try {
            String imageUrl = fileStorageService.storeProfilePicture(file, user.getId());
            user.setProfilePictureUrl(imageUrl);
            userRepository.save(user);
            return imageUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean removeProfilePicture(User user) {
        String imageUrl = user.getProfilePictureUrl();
        if (imageUrl != null) {
            fileStorageService.deleteFile(imageUrl);
            user.setProfilePictureUrl(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
