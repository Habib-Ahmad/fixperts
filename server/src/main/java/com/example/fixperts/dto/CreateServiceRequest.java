package com.example.fixperts.dto;

import com.example.fixperts.model.ServiceModel.ServiceCategory;

import java.util.List;

public class CreateServiceRequest {
    private String name;
    private String description;
    private double price;
    private ServiceCategory category;
    private boolean emergencyAvailable;
    private List<String> mediaUrls;

    // Getters and Setters
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

    public List<String> getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(List<String> mediaUrls) { this.mediaUrls = mediaUrls; }
}
