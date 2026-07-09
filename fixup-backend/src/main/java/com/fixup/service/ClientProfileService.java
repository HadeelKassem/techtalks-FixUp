package com.fixup.service;

import com.fixup.dto.ClientProfileDto;
import com.fixup.dto.UpdateClientProfileRequest;
import com.fixup.model.ClientProfile;
import com.fixup.model.User;
import com.fixup.repository.ClientProfileRepository;
import com.fixup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class ClientProfileService {

    
    private final ClientProfileRepository clientProfileRepository;
    private final UserRepository userRepository;

    //GET CLIENT PROFILE 
    public ClientProfileDto getClientProfile(Long userId) {

        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        
        ClientProfile profile = clientProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    ClientProfile newProfile = new ClientProfile();
                    newProfile.setUser(user);
                    return clientProfileRepository.save(newProfile);
                });

        
        return mapToDto(user, profile);
    }

    //UPDATE CLIENT PROFILE
    public ClientProfileDto updateClientProfile(Long userId, UpdateClientProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        ClientProfile profile = clientProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    ClientProfile newProfile = new ClientProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        // Only update fields if they were actually provided in the request
        if (request.getName() != null)             user.setUsername(request.getName());
        if (request.getPhone() != null)            profile.setPhone(request.getPhone());
        if (request.getAddress() != null)          profile.setAddress(request.getAddress());
        if (request.getCity() != null)             profile.setCity(request.getCity());
        if (request.getProfilePictureUrl() != null) profile.setProfilePictureUrl(request.getProfilePictureUrl());

        
        userRepository.save(user);
        clientProfileRepository.save(profile);

        return mapToDto(user, profile);
    }

    //PRIVATE HELPER:Entity -> DTO
    private ClientProfileDto mapToDto(User user, ClientProfile profile) {
        ClientProfileDto dto = new ClientProfileDto();
        dto.setUserId(user.getId());
        dto.setName(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhone(profile.getPhone());
        dto.setAddress(profile.getAddress());
        dto.setCity(profile.getCity());
        dto.setProfilePictureUrl(profile.getProfilePictureUrl());
        return dto;
    }
}
