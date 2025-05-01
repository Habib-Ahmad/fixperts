package com.example.fixperts.controller;

import com.example.fixperts.model.ChatMessage;
import com.example.fixperts.model.ChatNotification;
import com.example.fixperts.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.Principal;
import java.util.Date;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMessage = chatMessageService.save(chatMessage);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiverId(),
                "/queue/messages",
                ChatNotification.builder()
                        .senderId(chatMessage.getSenderId())
                        .receiverId(chatMessage.getReceiverId())
                        .build()
        );

    }

    @GetMapping("/messages/{senderId}/{receiverId}")
    public ResponseEntity<List<ChatMessage>> findChatMessage(
            @PathVariable String senderId,
            @PathVariable String receiverId
    ) {
        List<ChatMessage> messages = chatMessageService.findChatMessages(senderId, receiverId);
        return ResponseEntity.ok(messages);
    }
}