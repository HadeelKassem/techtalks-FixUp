package com.fixup.controller;

import com.fixup.dto.CreateProviderProfileRequest;
import com.fixup.dto.ProviderProfileDto;
import com.fixup.dto.UpdateProviderProfileRequest;
import com.fixup.service.ProviderProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/provider")
@RequiredArgsConstructor
public class ProviderProfileController {

    private final ProviderProfileService providerProfileService;

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
