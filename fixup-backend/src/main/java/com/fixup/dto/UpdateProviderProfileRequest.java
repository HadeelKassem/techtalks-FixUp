package com.fixup.dto;

import lombok.Data;

// Used when a PROVIDER edits their existing profile (PUT)
// Fields are optional here (no @NotBlank) — only update what's sent
@Data
public class UpdateProviderProfileRequest {

    private String bio;
    private String skills;
    private String serviceArea;
}
