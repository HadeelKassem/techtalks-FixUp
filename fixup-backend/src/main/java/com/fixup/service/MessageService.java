package com.fixup.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.fixup.dto.MessageDto;
import com.fixup.model.Message;
import com.fixup.model.ServiceRequest;
import com.fixup.model.User;
import com.fixup.repository.MessageRepository;
import com.fixup.repository.ServiceRequestRepository;
import com.fixup.repository.UserRepository;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<MessageDto> getMessages(Long bookingId, String requesterEmail) {
        ServiceRequest request = serviceRequestRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        assertIsParticipant(request, requesterEmail);

        return messageRepository.findByServiceRequestIdOrderBySentAtAsc(bookingId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public MessageDto sendMessage(Long bookingId, String text, String senderEmail) {
        ServiceRequest request = serviceRequestRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User sender = assertIsParticipant(request, senderEmail);

        Message message = new Message();
        message.setServiceRequest(request);
        message.setSender(sender);
        message.setText(text);

        Message saved = messageRepository.save(message);
        MessageDto dto = mapToDto(saved);

        messagingTemplate.convertAndSend("/topic/requests/" + bookingId + "/chat", dto);

        return dto;
    }

    // Only the client and provider tied to this booking may read/send messages.
    // Returns the resolved User so callers don't need a second lookup.
    private User assertIsParticipant(ServiceRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isClient = request.getClient() != null && request.getClient().getEmail().equals(email);
        boolean isProvider = request.getProvider() != null && request.getProvider().getEmail().equals(email);

        if (!isClient && !isProvider) {
            throw new RuntimeException("Not authorized to access this conversation");
        }

        return user;
    }

    private MessageDto mapToDto(Message message) {
        return new MessageDto(
                message.getId(),
                message.getSender().getRole().name(),
                message.getSender().getUsername(),
                message.getText(),
                message.getSentAt()
        );
    }
}
