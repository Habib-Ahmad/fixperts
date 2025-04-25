package com.example.fixperts.auth;

import com.example.fixperts.user.User;
import com.example.fixperts.user.UserRepository;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public void signup(AuthController.SignupRequest request) {
        if (userRepository.findByEmail(request.email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        String hashedPassword = passwordEncoder.encode(request.password);
        GeoJsonPoint location = new GeoJsonPoint(request.longitude, request.latitude);

        User user = new User(
                request.firstName,
                request.lastName,
                request.email,
                hashedPassword,
                User.Role.valueOf(request.role.toUpperCase()),
                location
        );

        userRepository.save(user);
    }

    public LoginResponse login(AuthController.LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.email);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(request.password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user);
        return new LoginResponse(token, user);
    }
}
