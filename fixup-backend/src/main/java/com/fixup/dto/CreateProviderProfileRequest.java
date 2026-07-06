package com.fixup.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateProviderProfileRequest {

    @NotBlank(message = "Bio is required")
    private String bio;

    @NotBlank(message = "Skills are required")
    private String skills;

    @NotBlank(message = "Service area is required")
    private String serviceArea;
}
