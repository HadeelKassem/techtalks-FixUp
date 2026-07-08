package com.fixup.service;

import org.springframework.stereotype.Service;

import com.fixup.dto.CreateProviderProfileRequest;
import com.fixup.dto.ProviderProfileDto;
import com.fixup.dto.UpdateProviderProfileRequest;
import com.fixup.model.ProviderProfile;
import com.fixup.model.User;
import com.fixup.repository.ProviderProfileRepository;
import com.fixup.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProviderProfileService {

    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;

    public ProviderProfileDto createProviderProfile(Long userId, CreateProviderProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (providerProfileRepository.findByUser(user).isPresent()) {
            throw new RuntimeException("Provider profile already exists for user: " + userId);
        }

        ProviderProfile profile = new ProviderProfile();
        profile.setUser(user);
        profile.setBio(request.getBio());
        profile.setSkills(request.getSkills());
        profile.setServiceArea(request.getServiceArea());

        providerProfileRepository.save(profile);

        return mapToDto(user, profile);
    }

    public ProviderProfileDto getProviderProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        ProviderProfile profile = providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Provider profile not found for user: " + userId));

        return mapToDto(user, profile);
    }

    public ProviderProfileDto updateProviderProfile(Long userId, UpdateProviderProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        ProviderProfile profile = providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Provider profile not found for user: " + userId));

        if (request.getBio() != null)         profile.setBio(request.getBio());
        if (request.getSkills() != null)      profile.setSkills(request.getSkills());
        if (request.getServiceArea() != null) profile.setServiceArea(request.getServiceArea());

        providerProfileRepository.save(profile);

        return mapToDto(user, profile);
    }

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
