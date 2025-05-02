package com.example.fixperts.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "services")
public class Service {
    @Id
    private String id;

    @Field("provider_id")
    private String providerId;      // references User.id

    private String name;
    private String description;
    private double price;
    private ServiceCategory category; // Change from String to ServiceCategory enum
    private boolean emergencyAvailable;
    private double averageRating;

    // Enum for service categories (10 categories)
    public enum ServiceCategory {
        PLUMBING,
        ELECTRICAL,
        CLEANING,
        HVAC,
        APPLIANCE_REPAIR,
        PEST_CONTROL,
        LANDSCAPING,
        PAINTING,
        MOVING,
        HANDYMAN
    }

    // Constructors
    public Service() {}

    public Service(String providerId, String name, String description, double price, ServiceCategory category, boolean emergencyAvailable) {
        this.providerId = providerId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.emergencyAvailable = emergencyAvailable;
    }

    // Getters and Setters
    public String getId() { return id; }

    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public ServiceCategory getCategory() { return category; }
    public void setCategory(ServiceCategory category) { this.category = category; }

    public boolean isEmergencyAvailable() { return emergencyAvailable; }
    public void setEmergencyAvailable(boolean emergencyAvailable) { this.emergencyAvailable = emergencyAvailable; }

    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }
}
