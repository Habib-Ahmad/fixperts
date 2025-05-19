//package com.example.fixperts.config;
//
//import com.example.fixperts.DataLoader.DummyDataLoader;
//import com.example.fixperts.model.Booking;
//import com.example.fixperts.model.ServiceModel;
//import com.example.fixperts.model.User;
//import com.example.fixperts.repository.BookingRepository;
//import com.example.fixperts.repository.ServiceRepository;
//import com.example.fixperts.repository.UserRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
//    private final BCryptPasswordEncoder passwordEncoder;
//
//    public DataLoader(UserRepository userRepository, ServiceRepository serviceRepository,
//                      BookingRepository bookingRepository, BCryptPasswordEncoder passwordEncoder) {
//        this.userRepository = userRepository;
//        this.serviceRepository = serviceRepository;
//        this.bookingRepository = bookingRepository;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        userRepository.deleteAll();
//        serviceRepository.deleteAll();
//        bookingRepository.deleteAll();
//
//        // Load and save users
//        User[] users = DummyDataLoader.getUsers(passwordEncoder);
//        userRepository.saveAll(Arrays.asList(users));
//        List<User> savedUsers = userRepository.findAll();
//        String[] userIds = savedUsers.stream().map(User::getId).toArray(String[]::new);
//
//        // Load and save services
//        ServiceModel[] services = DummyDataLoader.getServices(userIds);
//        serviceRepository.saveAll(Arrays.asList(services));
//
//        // Load and save bookings
//        Booking[] bookings = DummyDataLoader.getBookings(userIds, userIds, services);
//        bookingRepository.saveAll(Arrays.asList(bookings));
//
//        System.out.println(" Dummy data loaded successfully!");
//    }
//}
