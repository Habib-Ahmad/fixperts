package com.example.fixperts.dto;

import com.example.fixperts.model.ServiceModel;
import org.springframework.data.geo.Point;

public class NearbyServiceResponse {
    private ServiceModel service;
    private Point location; // location of the provider

    public NearbyServiceResponse(ServiceModel service, Point location) {
        this.service = service;
        this.location = location;
    }

    public ServiceModel getService() {
        return service;
    }

    public Point getLocation() {
        return location;
    }

    public void setService(ServiceModel service) {
        this.service = service;
    }

    public void setLocation(Point location) {
        this.location = location;
    }
}
