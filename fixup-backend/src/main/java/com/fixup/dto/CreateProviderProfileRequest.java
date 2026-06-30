package com.fixup.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// Used when a PROVIDER creates their profile for the first time (POST)
// @NotBlank = Spring Validation: rejects null or empty strings
// Spring will automatically return a 400 Bad Request if validation fails
@Data
public class CreateProviderProfileRequest {

    @NotBlank(message = "Bio is required")
    private String bio;

    @NotBlank(message = "Skills are required")
    private String skills;

    @NotBlank(message = "Service area is required")
    private String serviceArea;
}
