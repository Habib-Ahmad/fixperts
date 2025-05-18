//package com.example.fixperts.DataLoader;
//
//import com.example.fixperts.model.Booking;
//import com.example.fixperts.model.ServiceModel;
//import com.example.fixperts.model.User;
//import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//
//import java.time.LocalDate;
//import java.util.Random;
//
//public class DummyDataLoader {
//
//    public static User[] getUsers(BCryptPasswordEncoder encoder) {
//        String hashed = encoder.encode("123456");
//
//        return new User[]{
//                new User("Alice", "Smith", "alice@example.com", hashed, User.Role.USER, new GeoJsonPoint(2.3522, 48.8566)), // Paris
//                new User("Bob", "Johnson", "bob@example.com", hashed, User.Role.USER, new GeoJsonPoint(2.2876, 48.8625)), // Paris 16e
//                new User("Charlie", "Williams", "charlie@example.com", hashed, User.Role.USER, new GeoJsonPoint(1.4442, 43.6047)), // Toulouse
//                new User("Diana", "Brown", "diana@example.com", hashed, User.Role.USER, new GeoJsonPoint(-1.5536, 47.2184)), // Nantes
//                new User("Eve", "Jones", "eve@example.com", hashed, User.Role.USER, new GeoJsonPoint(5.3698, 43.2965)), // Marseille
//                new User("Frank", "Miller", "frank@example.com", hashed, User.Role.USER, new GeoJsonPoint(4.8357, 45.7640)), // Lyon
//                new User("Grace", "Davis", "grace@example.com", hashed, User.Role.USER, new GeoJsonPoint(7.2620, 43.7102)), // Nice
//                new User("Henry", "Wilson", "henry@example.com", hashed, User.Role.USER, new GeoJsonPoint(3.8767, 43.6119)), // Montpellier
//                new User("Isabelle", "Martin", "isabelle@example.com", hashed, User.Role.USER, new GeoJsonPoint(0.5792, 44.8378)), // Bordeaux
//                new User("Julien", "Leroy", "julien@example.com", hashed, User.Role.USER, new GeoJsonPoint(6.6339, 43.1258)), // Toulon
//        };
//    }
//
//
//    public static ServiceModel[] getServices(String[] userIds) {
//        return new ServiceModel[]{
//                new ServiceModel(userIds[0], "Plumbing Pros", "Expert leak repair and pipe installations for your home.", 80.0, ServiceModel.ServiceCategory.PLUMBING, true),
//                new ServiceModel(userIds[1], "QuickFix Plumbing", "Reliable solutions for clogged drains and water systems.", 95.0, ServiceModel.ServiceCategory.PLUMBING, false),
//
//                new ServiceModel(userIds[2], "Bright Sparks Electricians", "Safe and efficient electrical repairs and rewiring.", 90.0, ServiceModel.ServiceCategory.ELECTRICAL, true),
//                new ServiceModel(userIds[3], "ElectroFix Services", "Installation of modern lighting and home wiring upgrades.", 110.0, ServiceModel.ServiceCategory.ELECTRICAL, false),
//
//                new ServiceModel(userIds[4], "Fresh Start Cleaning", "Deep cleaning for kitchens, bathrooms, and living spaces.", 75.0, ServiceModel.ServiceCategory.CLEANING, true),
//                new ServiceModel(userIds[5], "Sparkle & Shine", "Top-rated residential and office cleaning services.", 85.0, ServiceModel.ServiceCategory.CLEANING, false),
//
//                new ServiceModel(userIds[6], "Cool Comfort HVAC", "AC and heating system maintenance to keep you comfortable.", 120.0, ServiceModel.ServiceCategory.HVAC, true),
//                new ServiceModel(userIds[7], "TempRight Solutions", "Professional HVAC diagnostics and seasonal tune-ups.", 130.0, ServiceModel.ServiceCategory.HVAC, false),
//
//                new ServiceModel(userIds[8], "Appliance Hero", "Quick and affordable washing machine and dryer repairs.", 95.0, ServiceModel.ServiceCategory.APPLIANCE_REPAIR, true),
//                new ServiceModel(userIds[9], "Fix-It Appliances", "We fix fridges, ovens, and more — all makes and models.", 100.0, ServiceModel.ServiceCategory.APPLIANCE_REPAIR, false),
//
//                new ServiceModel(userIds[0], "Bug Busters", "Effective and eco-friendly pest control for your home.", 85.0, ServiceModel.ServiceCategory.PEST_CONTROL, true),
//                new ServiceModel(userIds[1], "Shield Pest Services", "Protect your family from ants, rodents, and termites.", 90.0, ServiceModel.ServiceCategory.PEST_CONTROL, false),
//
//                new ServiceModel(userIds[2], "GreenScape Landscaping", "Transform your outdoor space with elegant garden design.", 150.0, ServiceModel.ServiceCategory.LANDSCAPING, true),
//                new ServiceModel(userIds[3], "Lawn Legends", "Lawn mowing, trimming, and seasonal yard maintenance.", 60.0, ServiceModel.ServiceCategory.LANDSCAPING, false),
//
//                new ServiceModel(userIds[4], "Brush & Roll Painting", "Beautiful interior wall painting with clean finishes.", 100.0, ServiceModel.ServiceCategory.PAINTING, true),
//                new ServiceModel(userIds[5], "ColorCraft Painters", "Exterior house painting with premium, lasting colors.", 120.0, ServiceModel.ServiceCategory.PAINTING, false),
//
//                new ServiceModel(userIds[6], "Easy Move Crew", "Let our pros help you pack and move stress-free.", 200.0, ServiceModel.ServiceCategory.MOVING, true),
//                new ServiceModel(userIds[7], "SafeShift Movers", "Reliable long-distance moving with full-service support.", 250.0, ServiceModel.ServiceCategory.MOVING, false),
//
//                new ServiceModel(userIds[8], "FixRight Handyman", "We handle repairs, installations, and odd jobs at home.", 65.0, ServiceModel.ServiceCategory.HANDYMAN, true),
//                new ServiceModel(userIds[9], "Handy Hub Services", "Skilled handymen for furniture assembly and minor fixes.", 70.0, ServiceModel.ServiceCategory.HANDYMAN, false),
//        };
//    }
//
//
//    public static Booking[] getBookings(String[] customerIds, String[] providerIds, ServiceModel[] services) {
//        return new Booking[] {
//                createBooking(services[0], customerIds[0], providerIds[1], "Fix leaking sink in kitchen", 75.0, Booking.BookingStatus.PENDING, LocalDate.now().plusDays(2)),
//                createBooking(services[1], customerIds[1], providerIds[2], "Install new bathroom pipes", 120.0, Booking.BookingStatus.CONFIRMED, LocalDate.now().plusDays(3)),
//                createBooking(services[2], customerIds[2], providerIds[3], "Replace broken light switch", 45.0, Booking.BookingStatus.PAID, LocalDate.now().plusDays(1)),
//                createBooking(services[3], customerIds[3], providerIds[4], "Install ceiling fan in bedroom", 90.0, Booking.BookingStatus.COMPLETED, LocalDate.now().minusDays(1)),
//                createBooking(services[4], customerIds[4], providerIds[5], "Deep clean kitchen and bathroom", 85.0, Booking.BookingStatus.CONFIRMED, LocalDate.now().plusDays(2)),
//                createBooking(services[5], customerIds[5], providerIds[6], "Weekly cleaning service", 60.0, Booking.BookingStatus.PENDING, LocalDate.now().plusDays(4)),
//                createBooking(services[6], customerIds[6], providerIds[7], "Fix air conditioning unit", 110.0, Booking.BookingStatus.PAID, LocalDate.now().plusDays(5)),
//                createBooking(services[7], customerIds[7], providerIds[8], "Install new heating system", 200.0, Booking.BookingStatus.CONFIRMED, LocalDate.now().plusDays(6)),
//                createBooking(services[8], customerIds[8], providerIds[9], "Repair dishwasher", 70.0, Booking.BookingStatus.CANCELLED, LocalDate.now().plusDays(1)),
//                createBooking(services[9], customerIds[9], providerIds[0], "Install new fridge", 95.0, Booking.BookingStatus.COMPLETED, LocalDate.now().minusDays(2))
//        };
//    }
//
//
//    private static Booking createBooking(ServiceModel service, String customerId, String providerId, String description, double price, Booking.BookingStatus status, LocalDate bookingDate) {
//        Booking b = new Booking();
//        b.setServiceId(service.getId());
//        b.setServiceName(service.getName());
//        b.setCustomerId(customerId);
//        b.setProviderId(providerId);
//        b.setDescription(description);
//        b.setPrice(price);
//        b.setStatus(status);
//        b.setBookingDate(bookingDate);
//        return b;
//    }
//
//}
