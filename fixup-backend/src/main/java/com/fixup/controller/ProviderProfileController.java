package com.fixup.controller;

import com.fixup.dto.CreateProviderProfileRequest;
import com.fixup.dto.ProviderProfileDto;
import com.fixup.dto.UpdateProviderProfileRequest;
import com.fixup.model.User;
import com.fixup.repository.UserRepository;
import com.fixup.service.ProviderProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
public class ProviderProfileController {

    private final ProviderProfileService providerProfileService;
    private final UserRepository userRepository;

    // GET /api/providers/me/profile — resolves the logged-in user from the JWT.
    @GetMapping("/me/profile")
    public ResponseEntity<ProviderProfileDto> getMyProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ProviderProfileDto profile = providerProfileService.getProviderProfile(user.getId());
        return ResponseEntity.ok(profile);
    }

    // PUT /api/providers/me/profile
    @PutMapping("/me/profile")
    public ResponseEntity<ProviderProfileDto> updateMyProfile(
            Authentication authentication,
            @RequestBody UpdateProviderProfileRequest request) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ProviderProfileDto updated = providerProfileService.updateProviderProfile(user.getId(), request);
        return ResponseEntity.ok(updated);
    }

    // Existing userId-based endpoints — unchanged.
    @PostMapping("/{userId}/profile")
    public ResponseEntity<ProviderProfileDto> createProviderProfile(
            @PathVariable Long userId,
            @Valid @RequestBody CreateProviderProfileRequest request) {

        ProviderProfileDto created = providerProfileService.createProviderProfile(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<ProviderProfileDto> getProviderProfile(@PathVariable Long userId) {
        ProviderProfileDto profile = providerProfileService.getProviderProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<ProviderProfileDto> updateProviderProfile(
            @PathVariable Long userId,
            @RequestBody UpdateProviderProfileRequest request) {

        ProviderProfileDto updated = providerProfileService.updateProviderProfile(userId, request);
        return ResponseEntity.ok(updated);
    }
}