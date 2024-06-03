package com.project.controller.chat;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private String content;
    private String sender;
    private MessageType type;
    private Date time;
    private String id;

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

}
