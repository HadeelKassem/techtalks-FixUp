package com.fixup.service;

import com.fixup.dto.PublicProviderDto;
import com.fixup.model.ProviderProfile;
import com.fixup.repository.ProviderProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublicProviderService {

    private final ProviderProfileRepository providerProfileRepository;

    public List<PublicProviderDto> getAllProviders() {
        return providerProfileRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public PublicProviderDto getProviderById(Long id) {
        ProviderProfile profile = providerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found with id: " + id));
        return mapToDto(profile);
    }

    private PublicProviderDto mapToDto(ProviderProfile profile) {
        PublicProviderDto dto = new PublicProviderDto();
        dto.setId(profile.getId());
        dto.setName(profile.getUser().getName());
        dto.setBio(profile.getBio());
        dto.setSkills(profile.getSkills());
        dto.setServiceArea(profile.getServiceArea());
        dto.setVerified(profile.isVerified());
        dto.setAvgRating(profile.getAvgRating());
        return dto;
    }
}