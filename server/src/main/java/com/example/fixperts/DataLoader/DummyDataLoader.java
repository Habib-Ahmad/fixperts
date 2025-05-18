//import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
//
//import java.time.LocalDate;
//import java.util.Random;
//
//public class DummyDataLoader {
//
//    public static User[] getUsers() {
//        return new User[] {
//                new User("Alice", "Smith", "alice@example.com", "hashedpwd1", User.Role.USER, new GeoJsonPoint(2.3522, 48.8566)), // Paris
//                new User("Bob", "Johnson", "bob@example.com", "hashedpwd2", User.Role.USER, new GeoJsonPoint(-0.1276, 51.5074)), // London
//                new User("Charlie", "Williams", "charlie@example.com", "hashedpwd3", User.Role.USER, new GeoJsonPoint(13.405, 52.52)), // Berlin
//                new User("Diana", "Brown", "diana@example.com", "hashedpwd4", User.Role.USER, new GeoJsonPoint(-74.006, 40.7128)), // NYC
//                new User("Eve", "Jones", "eve@example.com", "hashedpwd5", User.Role.USER, new GeoJsonPoint(151.2093, -33.8688)), // Sydney
//                new User("Frank", "Miller", "frank@example.com", "hashedpwd6", User.Role.USER, new GeoJsonPoint(139.6917, 35.6895)), // Tokyo
//                new User("Grace", "Davis", "grace@example.com", "hashedpwd7", User.Role.USER, new GeoJsonPoint(4.9041, 52.3676)), // Amsterdam
//                new User("Henry", "Wilson", "henry@example.com", "hashedpwd8", User.Role.USER, new GeoJsonPoint(12.4964, 41.9028)) // Rome
//        };
//    }
//
//    public static ServiceModel[] getServices(String[] providerIds) {
//        Random rand = new Random();
//        return new ServiceModel[] {
//                new ServiceModel(providerIds[rand.nextInt(providerIds.length)], "Home Plumbing", "Fix all plumbing issues", 75.0, ServiceModel.ServiceCategory.PLUMBING, true),
//                new ServiceModel(providerIds[rand.nextInt(providerIds.length)], "Electrical Wiring", "Safe and secure wiring services", 120.0, ServiceModel.ServiceCategory.ELECTRICAL, false),
//                new ServiceModel(providerIds[rand.nextInt(providerIds.length)], "House Cleaning", "Thorough cleaning of homes", 50.0, ServiceModel.ServiceCategory.CLEANING, true),
//                new ServiceModel(providerIds[rand.nextInt(providerIds.length)], "HVAC Repair", "Heating and cooling system maintenance", 150.0, ServiceModel.ServiceCategory.HVAC, true),
//                new ServiceModel(providerIds[rand.nextInt(providerIds.length)], "Appliance Repair", "Fix your broken appliances", 80.0, ServiceModel.ServiceCategory.APPLIANCE_REPAIR, false),
//                new ServiceModel(providerIds[rand.nextInt(providerIds.length)], "Pest Control", "Keep your house pest-free", 90.0, ServiceModel.ServiceCategory.PEST_CONTROL, true),
//                new ServiceModel(providerIds[rand.nextInt(providerIds.length)], "Landscaping", "Beautiful garden design and maintenance", 200.0, ServiceModel.ServiceCategory.LANDSCAPING, false),
//                new ServiceModel(providerIds[rand.nextInt(providerIds.length)], "Painting", "Interior and exterior painting", 100.0, ServiceModel.ServiceCategory.PAINTING, true),
//                new ServiceModel(providerIds[rand.nextInt(providerIds.length)], "Moving Help", "Professional moving services", 130.0, ServiceModel.ServiceCategory.MOVING, false),
//                new ServiceModel(providerIds[rand.nextInt(providerIds.length)], "Handyman Services", "General household repairs", 60.0, ServiceModel.ServiceCategory.HANDYMAN, true)
//        };
//    }
//
//    public static Booking[] getBookings(String[] customerIds, String[] providerIds, String[] serviceIds) {
//        return new Booking[] {
//                createBooking(serviceIds[0], customerIds[0], providerIds[0], "Fix leaking sink", 75.0, Booking.BookingStatus.PENDING, LocalDate.now().plusDays(2)),
//                createBooking(serviceIds[2], customerIds[1], providerIds[1], "Clean my apartment", 50.0, Booking.BookingStatus.CONFIRMED, LocalDate.now().plusDays(3)),
//                createBooking(serviceIds[4], customerIds[2], providerIds[2], "Repair washing machine", 80.0, Booking.BookingStatus.PAID, LocalDate.now().plusDays(5)),
//                createBooking(serviceIds[7], customerIds[3], providerIds[3], "Paint living room", 100.0, Booking.BookingStatus.COMPLETED, LocalDate.now().minusDays(1)),
//                createBooking(serviceIds[9], customerIds[4], providerIds[4], "Fix broken door", 60.0, Booking.BookingStatus.CANCELLED, LocalDate.now().plusDays(4))
//        };
//    }
//
//    private static Booking createBooking(String serviceId, String customerId, String providerId, String description, double price, Booking.BookingStatus status, LocalDate bookingDate) {
//        Booking b = new Booking();
//        b.setServiceId(serviceId);
//        b.setCustomerId(customerId);
//        b.setProviderId(providerId);
//        b.setDescription(description);
//        b.setPrice(price);
//        b.setStatus(status);
//        b.setBookingDate(bookingDate);
//        b.setServiceName(""); // Optional: set later if needed
//        return b;
//    }
//}
