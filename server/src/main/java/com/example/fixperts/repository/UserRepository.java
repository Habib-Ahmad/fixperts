package com.example.fixperts.repository;

import com.example.fixperts.model.User;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);


    List<User> findByLocationNear(Point location, Distance distance);
}
