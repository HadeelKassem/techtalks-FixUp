package com.fixup.controller;

import com.fixup.dto.request.LoginRequest;
import com.fixup.dto.request.RegisterRequest;
import com.fixup.dto.response.LoginResponse;
import com.fixup.dto.response.RegisterResponse;
import com.fixup.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}