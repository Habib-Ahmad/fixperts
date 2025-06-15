package com.example.fixperts.repository;

import com.example.fixperts.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByConversationIdOrderByTimestampAsc(String conversationId);
    Optional<Message> findFirstByConversationIdOrderByTimestampDesc(String conversationId);
    int countByConversationIdAndSenderIdNotAndStatus(String conversationId, String senderId, String status);
    List<Message> findByConversationIdAndSenderIdNotAndStatus(String conversationId, String senderId, String status);
}
