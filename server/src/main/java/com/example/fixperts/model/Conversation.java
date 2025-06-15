package com.example.fixperts.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "conversations")
public class Conversation {
    @Id
    private String id;
    private List<String> participantIds;

    public Conversation() {}

    public Conversation(List<String> participantIds) {
        this.participantIds = participantIds;
    }

    public String getId() {
        return id;
    }

    public List<String> getParticipantIds() {
        return participantIds;
    }

    public void setParticipantIds(List<String> participantIds){
        this.participantIds = participantIds;
    }
}
