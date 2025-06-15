package com.example.fixperts.dto;

import com.example.fixperts.model.User;

import java.util.Date;
import java.util.List;

public class ConversationResponse {
    private String id;
    private User otherParticipant;
    private String lastMessage;
    private Date lastMessageTime;
    private int unreadCount;

    public ConversationResponse() {}

    public ConversationResponse(String id, User otherParticipant, String lastMessage, Date lastMessageTime, int unreadCount) {
        this.id = id;
        this.otherParticipant = otherParticipant;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
        this.unreadCount = unreadCount;
    }

    public String getId() {
        return id;
    }

    public User getParticipantProfile() {
        return otherParticipant;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getOtherParticipant() {
        return otherParticipant;
    }

    public void setOtherParticipant(User otherParticipant) {
        this.otherParticipant = otherParticipant;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public Date getLastMessageTime() {
        return lastMessageTime;
    }

    public void setLastMessageTime(Date lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }

    public int getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(int unreadCount) {
        this.unreadCount = unreadCount;
    }
}
