package com.example.fixperts.controller;

import com.example.fixperts.dto.ConversationRequest;
import com.example.fixperts.dto.ConversationResponse;
import com.example.fixperts.model.Conversation;
import com.example.fixperts.service.ConversationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@Tag(name = "Conversation")
public class ConversationController {
    @Autowired
    private ConversationService conversationService;

    // Get or create a conversation between 2 users
    @PostMapping("/getOrCreate")
    public ConversationResponse getOrCreateConversation(@RequestBody ConversationRequest request) {
        return conversationService.getOrCreateConversation(request.getUserId1(), request.getUserId2());
    }

    // Get all conversations for a user
    @GetMapping("/{userId}")
    public List<ConversationResponse> getUserConversations(@PathVariable String userId) {
        return conversationService.getUserConversations(userId);
    }
}
