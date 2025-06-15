package com.example.fixperts.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String serviceName;
    private String serviceId;
    private String customerId;
    private String providerId;
    private LocalDate bookingDate;
    private String description;
    private double price;

    private BookingStatus status;
    private PaymentStatus paymentStatus; // ✅ NEW FIELD

    public enum BookingStatus {
        PENDING,
        CONFIRMED,
        REJECTED,
        PAID,
        COMPLETED,
        QUOTED,
        CANCELLED,
        REVIEWED
        }

    public enum PaymentStatus { // ✅ NEW ENUM
        PENDING,
        PAID
    }

    // ====== Getters and Setters ======

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

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

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public PaymentStatus getPaymentStatus() { // ✅ NEW GETTER
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) { // ✅ NEW SETTER
        this.paymentStatus = paymentStatus;
    }
}
