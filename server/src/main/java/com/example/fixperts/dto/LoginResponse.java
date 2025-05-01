package com.example.fixperts.dto;

import com.example.fixperts.model.User;

public record LoginResponse(String token, User user) {
}
