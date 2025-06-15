package com.example.fixperts.service;

import com.example.fixperts.model.Message;
import com.example.fixperts.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(String conversationId, String senderId, String content) {
        Message message = new Message(
                conversationId,
                senderId,
                content,
                new Date(),
                "UNREAD"
        );
        return messageRepository.save(message);
    }

    public List<Message> getMessagesForConversation(String conversationId) {
        return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    public Message getLastMessage(String conversationId) {
        return messageRepository.findFirstByConversationIdOrderByTimestampDesc(conversationId).orElse(null);
    }

    public void markMessagesAsRead(String conversationId, String userId) {
        List<Message> unreadMessages = messageRepository.findByConversationIdAndSenderIdNotAndStatus(conversationId, userId, "UNREAD");
        unreadMessages.forEach(msg -> msg.setStatus("READ"));
        messageRepository.saveAll(unreadMessages);
    }
}
