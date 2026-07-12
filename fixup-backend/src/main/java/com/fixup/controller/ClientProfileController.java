package com.fixup.controller;

import com.fixup.dto.ClientProfileDto;
import com.fixup.dto.UpdateClientProfileRequest;
import com.fixup.model.User;
import com.fixup.repository.UserRepository;
import com.fixup.service.ClientProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients") // plural — matches ProviderProfileController's "/api/providers" convention
@RequiredArgsConstructor
public class ClientProfileController {

    private final ClientProfileService clientProfileService;
    private final UserRepository userRepository;

    // GET /api/clients/me/profile — resolves the logged-in user from the JWT.
    // Authentication.getName() returns the email set as the token's subject.
    @GetMapping("/me/profile")
    public ResponseEntity<ClientProfileDto> getMyProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ClientProfileDto profile = clientProfileService.getClientProfile(user.getId());
        return ResponseEntity.ok(profile);
    }

    // PUT /api/clients/me/profile
    @PutMapping("/me/profile")
    public ResponseEntity<ClientProfileDto> updateMyProfile(
            Authentication authentication,
            @RequestBody UpdateClientProfileRequest request) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ClientProfileDto updated = clientProfileService.updateClientProfile(user.getId(), request);
        return ResponseEntity.ok(updated);
    }

    // Existing userId-based endpoints — left in place in case anything
    // (e.g. an admin view) still needs to look up a specific client by ID.
    @GetMapping("/{userId}/profile")
    public ResponseEntity<ClientProfileDto> getClientProfile(@PathVariable Long userId) {
        ClientProfileDto profile = clientProfileService.getClientProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<ClientProfileDto> updateClientProfile(
            @PathVariable Long userId,
            @RequestBody UpdateClientProfileRequest request) {
        ClientProfileDto updated = clientProfileService.updateClientProfile(userId, request);
        return ResponseEntity.ok(updated);
    }
}