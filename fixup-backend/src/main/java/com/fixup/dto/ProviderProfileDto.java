package com.fixup.dto;

import lombok.Data;

@Data
public class ProviderProfileDto {
    private Long userId;
    private String name;
    private String email;
    private String bio;
    private String skills;
    private String serviceArea;
    private String profilePictureUrl;
    private boolean verified;
    private double avgRating;
}