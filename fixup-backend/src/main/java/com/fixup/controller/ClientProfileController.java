package com.fixup.controller;

import com.fixup.dto.ClientProfileDto;
import com.fixup.dto.UpdateClientProfileRequest;
import com.fixup.service.ClientProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientProfileController {

    private final ClientProfileService clientProfileService;

    // GET /api/clients/{userId}/profile
    @GetMapping("/{userId}/profile")
    public ResponseEntity<ClientProfileDto> getClientProfile(@PathVariable Long userId) {
        ClientProfileDto profile = clientProfileService.getClientProfile(userId);
        return ResponseEntity.ok(profile);            // 200 OK + JSON body
    }

    // PUT /api/clients/{userId}/profile
    
    @PutMapping("/{userId}/profile")
    public ResponseEntity<ClientProfileDto> updateClientProfile(
            @PathVariable Long userId,
            @RequestBody UpdateClientProfileRequest request) {

        ClientProfileDto updated = clientProfileService.updateClientProfile(userId, request);
        return ResponseEntity.ok(updated);            // 200 OK + updated JSON body
    }
}
