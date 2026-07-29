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
    private boolean isVerified;
    private double avgRating;

    // The single category this provider offers services under.
    private Long categoryId;
    private String categoryName;
}