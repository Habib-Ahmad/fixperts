package com.example.fixperts.service;

import com.example.fixperts.model.ServiceModel;
import com.example.fixperts.model.User;
import com.example.fixperts.repository.ServiceRepository;
import com.example.fixperts.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    public AdminService(UserRepository userRepository, ServiceRepository serviceRepository) {

        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
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
        user.setBanned(true);
        userRepository.save(user);
    }

    public List<ServiceModel> getAllUnvalidatedServices() {
        return serviceRepository.findByValidatedFalse();
    }
}
