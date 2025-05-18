package com.example.fixperts.dto;

import java.time.LocalDate;

public class CreateBookingRequest {
    private LocalDate bookingDate;
    private String description;


    // Getters and Setters
    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
