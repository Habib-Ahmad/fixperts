package com.example.fixperts.repository;

import com.example.fixperts.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends MongoRepository<Conversation, String> {
    // Find a conversation between exactly two participants
    Optional<Conversation> findByParticipantIds(List<String> participantIds);

    // List all conversations for a participant
    List<Conversation> findByParticipantIdsContains(String participantId);
}
