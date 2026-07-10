package com.fixup.controller;


import com.fixup.model.ChatMessage;
import com.fixup.model.User;
import com.fixup.repository.ChatMessageRepository;
import com.fixup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import com.fixup.dto.ChatMessageDTO;
import java.security.Principal;
import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    // Client sends to: /app/requests/{requestId}/chat.send
    // Broadcasts to:   /topic/requests/{requestId}/chat
    @MessageMapping("/requests/{requestId}/chat.send")
    public void sendMessage(
            @DestinationVariable Long requestId,
            @Payload ChatMessageDTO incoming, 
            Principal principal) {

        // stomp.getName() is the email set by JwtHandshakeChannelInterceptor
        
        User sender = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatMessage saved = chatMessageRepository.save(
                ChatMessage.builder()
                        .requestId(requestId)
                        .senderEmail(sender.getEmail())
                        .senderName(sender.getUsername())
                        .content(incoming.getContent())
                        .sentAt(LocalDateTime.now())
                        .build()
        );

        ChatMessageDTO outgoing = toDto(saved);

        messagingTemplate.convertAndSend("/topic/requests/" + requestId + "/chat", outgoing);
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