package com.example.fixperts.controller;

import com.example.fixperts.dto.MessageRequest;
import com.example.fixperts.model.Message;
import com.example.fixperts.service.MessageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@Tag(name = "Messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // for sending via WebSocket

    @PostMapping("/send")
    public Message sendMessage(
            @RequestBody MessageRequest request
            ) {
        Message saved = messageService.saveMessage(request.getConversationId(), request.getSenderId(), request.getContent());

        // Broadcast to WebSocket topic for this conversation
        messagingTemplate.convertAndSend("/topic/conversations/" + request.getConversationId(), saved);

        return saved;
    }

    // Get all messages for a conversation
    @GetMapping("/{conversationId}")
    public List<Message> getMessages(@PathVariable String conversationId) {
        return messageService.getMessagesForConversation(conversationId);
    }

    @PostMapping("/mark-read")
    public ResponseEntity<Void> markMessagesAsRead(
            @RequestParam String conversationId,
            @RequestParam String userId) {
        messageService.markMessagesAsRead(conversationId, userId);
        return ResponseEntity.ok().build();
    }
}
