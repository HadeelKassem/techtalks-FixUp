package com.fixup.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessageDTO {
    private Long requestId;
    private String senderEmail;
    private String senderName;
    private String content;
    private LocalDateTime sentAt;
}