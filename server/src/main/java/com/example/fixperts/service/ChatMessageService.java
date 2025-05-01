//package com.example.fixperts.service;
//
//import com.example.fixperts.model.ChatMessage;
//import com.example.fixperts.repository.ChatMessageRepository;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class ChatMessageService {
//    private final ChatMessageRepository chatMessageRepository;
//    private final ChatService chatService;
//
//
//    public ChatMessageService(ChatMessageRepository chatMessageRepository, ChatService chatService) {
//        this.chatMessageRepository = chatMessageRepository;
//        this.chatService = chatService;
//    }
//    public ChatMessage save(ChatMessage chatMessage) {
//        var chatId=chatService.getChatRoomId(chatMessage.getSenderId(), chatMessage.getReceiverId(),true);
//        chatMessage.setChatId(chatId.orElseThrow(()->new RuntimeException("Chat room not found")));
//        return chatMessageRepository.save(chatMessage);
//    }
//    public List<ChatMessage> findChatMessages(String senderId, String receiverId) {
//        var chatId=chatService.getChatRoomId(senderId, receiverId,false);
//        if (chatId.isPresent()) {
//            return chatMessageRepository.findByChatId(chatId.get());
//        } else {
//            return new ArrayList<>();
//        }
//
//    }
//}
