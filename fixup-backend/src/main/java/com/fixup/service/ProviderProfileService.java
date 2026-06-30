package com.fixup.service;

import com.fixup.dto.CreateProviderProfileRequest;
import com.fixup.dto.ProviderProfileDto;
import com.fixup.dto.UpdateProviderProfileRequest;
import com.fixup.model.ProviderProfile;
import com.fixup.model.User;
import com.fixup.repository.ProviderProfileRepository;
import com.fixup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProviderProfileService {

    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;

    // ── CREATE PROVIDER PROFILE ─────────────────────────────────────────────
    public ProviderProfileDto createProviderProfile(Long userId, CreateProviderProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Guard: a provider should only create their profile once
        if (providerProfileRepository.findByUser(user).isPresent()) {
            throw new RuntimeException("Provider profile already exists for user: " + userId);
        }

        // Build and persist the new profile
        ProviderProfile profile = new ProviderProfile();
        profile.setUser(user);
        profile.setBio(request.getBio());
        profile.setSkills(request.getSkills());
        profile.setServiceArea(request.getServiceArea());
        // isVerified defaults to false (set in the entity), avgRating defaults to 0.0

        providerProfileRepository.save(profile);

        return mapToDto(user, profile);
    }

    // ── GET PROVIDER PROFILE ────────────────────────────────────────────────
    public ProviderProfileDto getProviderProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        ProviderProfile profile = providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Provider profile not found for user: " + userId));

        return mapToDto(user, profile);
    }

    // ── EDIT PROVIDER PROFILE ───────────────────────────────────────────────
    public ProviderProfileDto updateProviderProfile(Long userId, UpdateProviderProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        ProviderProfile profile = providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Provider profile not found for user: " + userId));

        // Partial update — only touch fields that were sent
        if (request.getBio() != null)         profile.setBio(request.getBio());
        if (request.getSkills() != null)      profile.setSkills(request.getSkills());
        if (request.getServiceArea() != null) profile.setServiceArea(request.getServiceArea());

        providerProfileRepository.save(profile);

        return mapToDto(user, profile);
    }

    // ── PRIVATE HELPER: Entity → DTO ────────────────────────────────────────
    private ProviderProfileDto mapToDto(User user, ProviderProfile profile) {
        ProviderProfileDto dto = new ProviderProfileDto();
        dto.setUserId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setBio(profile.getBio());
        dto.setSkills(profile.getSkills());
        dto.setServiceArea(profile.getServiceArea());
        dto.setVerified(profile.isVerified());
        dto.setAvgRating(profile.getAvgRating());
        return dto;
    }
}
