package com.example.fixperts.dto;

public class MessageRequest {
    private String conversationId;
    private String senderId;
    private String content;

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId() {
        this.conversationId = conversationId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
