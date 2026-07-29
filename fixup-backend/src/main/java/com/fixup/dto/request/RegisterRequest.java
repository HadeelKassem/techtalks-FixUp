package com.fixup.dto.request;

import com.fixup.model.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String username;

    private String email;

    private String password;

    private String phoneNumber;

    private Role role;

    // Provider only
    private String description;

    private String location;

    // Provider only — the single category this provider offers services under
    private Long categoryId;
}