package com.example.Authentication.dto.request;

import com.example.Authentication.entity.Role;
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
}