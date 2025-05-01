//package com.example.fixperts.service;
//
//import com.example.fixperts.model.ChatRoom;
//import com.example.fixperts.repository.ChatRoomRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//public class ChatService {
//    private final ChatRoomRepository chatRoomRepository;
//    public Optional<String> getChatRoomId(String senderId, String receiverId,boolean createRoomIfNotExists) {
//        // Implement logic to get or create a chat room ID based on sender and receiver IDs
//        // This is a placeholder implementation
//        return chatRoomRepository.findBySenderIdAndReceiverId(senderId, receiverId)
//                .map(ChatRoom::getChatId)
//                .or(() -> {
//                    if (createRoomIfNotExists) {
//                        // Create a new chat room if it doesn't exist
//                        var chatId=createChatId(senderId, receiverId);
//                        return Optional.of(chatId);
//                    }
//                    return Optional.empty();
//                });
//
//    }
//    private String createChatId(String senderId, String receiverId) {
//        var chatId=String.format("%s_%s", senderId, receiverId);
//        ChatRoom senderReceiver=ChatRoom.builder()
//                .chatId(chatId)
//                .senderId(senderId)
//                .receiverId(receiverId)
//                .build();
//        ChatRoom receiverSender=ChatRoom.builder()
//                .chatId(chatId)
//                .senderId(receiverId)
//                .receiverId(senderId)
//                .build();
//        chatRoomRepository.save(senderReceiver);
//        chatRoomRepository.save(receiverSender);
//        return null;
//    }
//}
