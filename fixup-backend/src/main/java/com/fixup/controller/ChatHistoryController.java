package com.fixup.controller;

import com.fixup.dto.ChatMessageDTO;
import com.fixup.model.ChatMessage;
import com.fixup.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class ChatHistoryController {

    private final ChatMessageRepository chatMessageRepository;

    // GET /api/requests/{requestId}/messages
    @GetMapping("/{requestId}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getMessages(@PathVariable Long requestId) {
        List<ChatMessageDTO> messages = chatMessageRepository
                .findByRequestIdOrderBySentAtAsc(requestId)
                .stream()
                .map(this::toDto)
                .toList();

        return ResponseEntity.ok(messages);
    }

    private ChatMessageDTO toDto(ChatMessage message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setRequestId(message.getRequestId());
        dto.setSenderEmail(message.getSenderEmail());
        dto.setSenderName(message.getSenderName());
        dto.setContent(message.getContent());
        dto.setSentAt(message.getSentAt());
        return dto;
    }
}