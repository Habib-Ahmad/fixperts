package com.example.fixperts.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String bookingId;     // Ensure one review per author per booking

    private String authorId;      // Who wrote the review (client or provider)
    private String targetId;      // Who/what is being reviewed (service or client)
    private String targetType;    // "SERVICE" or "CLIENT"

    private int rating;           // 1 to 5
    private String comment;

    private LocalDateTime createdAt;

    public Review() {}

    public Review(String serviceId, String bookingId, String authorId, String targetId, String targetType, int rating, String comment) {
        this.bookingId = bookingId;
        this.authorId = authorId;
        this.targetId = targetId;
        this.targetType = targetType;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }



    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
