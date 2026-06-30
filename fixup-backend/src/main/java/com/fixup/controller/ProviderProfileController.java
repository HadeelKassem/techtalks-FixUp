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
@RequestMapping("/api/providers")
@RequiredArgsConstructor
public class ProviderProfileController {

    private final ProviderProfileService providerProfileService;

    // POST /api/providers/{userId}/profile
    // @Valid → triggers the @NotBlank validations defined in CreateProviderProfileRequest
    //          Spring auto-returns 400 Bad Request if validation fails
    @PostMapping("/{userId}/profile")
    public ResponseEntity<ProviderProfileDto> createProviderProfile(
            @PathVariable Long userId,
            @Valid @RequestBody CreateProviderProfileRequest request) {

        ProviderProfileDto created = providerProfileService.createProviderProfile(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);  // 201 Created
    }

    // GET /api/providers/{userId}/profile
    @GetMapping("/{userId}/profile")
    public ResponseEntity<ProviderProfileDto> getProviderProfile(@PathVariable Long userId) {
        ProviderProfileDto profile = providerProfileService.getProviderProfile(userId);
        return ResponseEntity.ok(profile);   // 200 OK
    }

    // PUT /api/providers/{userId}/profile
    @PutMapping("/{userId}/profile")
    public ResponseEntity<ProviderProfileDto> updateProviderProfile(
            @PathVariable Long userId,
            @RequestBody UpdateProviderProfileRequest request) {

        ProviderProfileDto updated = providerProfileService.updateProviderProfile(userId, request);
        return ResponseEntity.ok(updated);   // 200 OK
    }
}
