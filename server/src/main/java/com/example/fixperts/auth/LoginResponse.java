package com.example.fixperts.auth;

import com.example.fixperts.user.User;

public record LoginResponse(String token, User user) {
}
