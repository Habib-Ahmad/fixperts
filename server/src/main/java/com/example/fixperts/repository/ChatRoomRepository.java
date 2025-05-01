//package com.example.fixperts.repository;
//
//import com.example.fixperts.model.ChatRoom;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.mongodb.core.MongoTemplate;
//import org.springframework.data.mongodb.core.query.Criteria;
//import org.springframework.data.mongodb.repository.MongoRepository;
//import org.springframework.data.mongodb.repository.Query;
//
//import java.util.List;
//import java.util.Optional;
//
//public interface ChatRoomRepository  extends MongoRepository<ChatRoom, String> {
//
//    Optional<ChatRoom> findBySenderIdAndReceiverId(String senderId, String receiverId);
//}
