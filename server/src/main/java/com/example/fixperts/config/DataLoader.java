//import com.example.fixperts.repository.BookingRepository;
//import com.example.fixperts.repository.ServiceRepository;
//import com.example.fixperts.repository.UserRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.util.Arrays;
//import java.util.List;
//
//@Component
//public class DataLoader implements CommandLineRunner {
//
//    private final UserRepository userRepository;
//    private final ServiceRepository serviceRepository;
//    private final BookingRepository bookingRepository;
//
//    public DataLoader(UserRepository userRepository, ServiceRepository serviceRepository, BookingRepository bookingRepository) {
//        this.userRepository = userRepository;
//        this.serviceRepository = serviceRepository;
//        this.bookingRepository = bookingRepository;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        // Clear existing data
//        userRepository.deleteAll();
//        serviceRepository.deleteAll();
//        bookingRepository.deleteAll();
//
//        // Create and save users
//        User[] users = DummyDataLoader.getUsers();
//        userRepository.saveAll(Arrays.asList(users));
//
//        // Fetch saved users with generated IDs
//        List<User> savedUsers = userRepository.findAll();
//
//        // Use all users as both providers and customers
//        List<String> userIds = savedUsers.stream()
//                .map(User::getId)
//                .toList();
//
//        // Create and save services with random provider IDs from all users
//        ServiceModel[] services = DummyDataLoader.getServices(userIds.toArray(new String[0]));
//        serviceRepository.saveAll(Arrays.asList(services));
//
//        // Fetch saved services with IDs
//        List<ServiceModel> savedServices = serviceRepository.findAll();
//        String[] serviceIds = savedServices.stream()
//                .map(ServiceModel::getId)
//                .toArray(String[]::new);
//
//        // Create and save bookings (customers and providers from same pool)
//        Booking[] bookings = DummyDataLoader.getBookings(
//                userIds.toArray(new String[0]), // customers
//                userIds.toArray(new String[0]), // providers
//                serviceIds
//        );
//        bookingRepository.saveAll(Arrays.asList(bookings));
//
//        System.out.println("Dummy data loaded successfully!");
//    }
//}
