package com.fixup.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private Long id;
    private String senderRole; // "CLIENT" or "PROVIDER"
    private String senderName;
    private String text;
    private LocalDateTime sentAt;
}