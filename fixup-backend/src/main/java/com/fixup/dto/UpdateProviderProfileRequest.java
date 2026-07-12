package com.fixup.dto;

import lombok.Data;
@Data
public class UpdateProviderProfileRequest {
    private String bio;
    private String skills;
    private String serviceArea;
    private String profilePictureUrl;
}