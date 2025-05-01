package com.example.fixperts.service;

import com.example.fixperts.model.User;
import com.example.fixperts.repository.UserRepository;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public List<User> getNearbyServiceProviders(Point location, Distance distance) {
        return userRepository.findByRoleAndLocationNear(User.Role.SERVICE_PROVIDER, location, distance);
    }
}
