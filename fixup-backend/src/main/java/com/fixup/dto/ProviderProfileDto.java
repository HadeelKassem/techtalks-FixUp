package com.fixup.dto;

import lombok.Data;

// Response DTO for provider profile — exposes only what the API should return
@Data
public class ProviderProfileDto {

    private Long userId;
    private String name;
    private String email;

    // Provider-specific fields (from ProviderProfile entity)
    private String bio;
    private String skills;
    private String serviceArea;
    private boolean isVerified;
    private double avgRating;
}
