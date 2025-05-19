package com.example.fixperts.dto;

import com.example.fixperts.model.User;

public class UserProfileResponse {
    private User user;
    private int providedServicesCount;
    private int completedOrOngoingBookingsCount;

    public UserProfileResponse(User user, int providedServicesCount, int completedOrOngoingBookingsCount) {
        this.user = user;
        this.providedServicesCount = providedServicesCount;
        this.completedOrOngoingBookingsCount = completedOrOngoingBookingsCount;
    }

    public User getUser() {
        return user;
    }

    public int getProvidedServicesCount() {
        return providedServicesCount;
    }

    public int getCompletedOrOngoingBookingsCount() {
        return completedOrOngoingBookingsCount;
    }
}
