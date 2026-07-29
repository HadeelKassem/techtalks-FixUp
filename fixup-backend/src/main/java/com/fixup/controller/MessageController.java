package com.fixup.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fixup.dto.MessageDto;
import com.fixup.dto.SendMessageRequest;
import com.fixup.service.MessageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings/{bookingId}/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping
    public ResponseEntity<List<MessageDto>> getMessages(
            @PathVariable Long bookingId,
            Authentication authentication) {
        return ResponseEntity.ok(messageService.getMessages(bookingId, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable Long bookingId,
            @Valid @RequestBody SendMessageRequest request,
            Authentication authentication) {
        return ResponseEntity.status(201).body(
                messageService.sendMessage(bookingId, request.getText(), authentication.getName()));
    }
} 
 

