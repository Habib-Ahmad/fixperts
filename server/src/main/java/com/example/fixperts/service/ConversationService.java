package com.example.fixperts.service;

import com.example.fixperts.dto.ConversationResponse;
import com.example.fixperts.model.Conversation;
import com.example.fixperts.model.Message;
import com.example.fixperts.model.User;
import com.example.fixperts.repository.ConversationRepository;
import com.example.fixperts.repository.MessageRepository;
import com.example.fixperts.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    public ConversationService(ConversationRepository conversationRepository, UserRepository userRepository, MessageRepository messageRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }


    public ConversationResponse getOrCreateConversation(String userId1, String userId2) {
        List<String> participants = Arrays.asList(userId1, userId2);
        participants.sort(String::compareTo);

        Conversation conversation = conversationRepository.findByParticipantIds(participants)
                .orElseGet(() -> conversationRepository.save(new Conversation(participants)));

        String otherUserId = conversation.getParticipantIds().stream()
                .filter(id -> id.equals(userId2))
                .findFirst()
                .orElse(null);

        User otherUser = otherUserId != null ? userRepository.findById(otherUserId).orElse(null) : null;

        Optional<Message> lastMessageOpt = messageRepository.findFirstByConversationIdOrderByTimestampDesc(conversation.getId());
        String lastMessageContent = lastMessageOpt.map(Message::getContent).orElse("");
        Date lastMessageTime = lastMessageOpt.map(Message::getTimestamp).orElse(null);

        // ✅ Count unread for caller
        int unreadCount = messageRepository.countByConversationIdAndSenderIdNotAndStatus(
                conversation.getId(), userId1, "UNREAD");

        return new ConversationResponse(
                conversation.getId(),
                otherUser,
                lastMessageContent,
                lastMessageTime,
                unreadCount
        );
    }

    public List<ConversationResponse> getUserConversations(String userId) {
        return conversationRepository.findByParticipantIdsContains(userId).stream()
                .map(conversation -> {
                    String otherUserId = conversation.getParticipantIds().stream()
                            .filter(id -> !id.equals(userId))
                            .findFirst()
                            .orElse(null);

                    User otherUser = otherUserId != null ? userRepository.findById(otherUserId).orElse(null) : null;

                    Optional<Message> lastMessageOpt = messageRepository.findFirstByConversationIdOrderByTimestampDesc(conversation.getId());
                    String lastMessageContent = lastMessageOpt.map(Message::getContent).orElse("");
                    Date lastMessageTime = lastMessageOpt.map(Message::getTimestamp).orElse(null);

                    int unreadCount = messageRepository.countByConversationIdAndSenderIdNotAndStatus(
                            conversation.getId(), userId, "UNREAD");

                    return new ConversationResponse(
                            conversation.getId(),
                            otherUser,
                            lastMessageContent,
                            lastMessageTime,
                            unreadCount
                    );
                })
                .collect(Collectors.toList());
    }
}
