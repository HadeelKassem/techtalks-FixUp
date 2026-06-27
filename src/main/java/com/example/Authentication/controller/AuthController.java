package com.example.Authentication.controller;

import com.example.Authentication.dto.request.RegisterRequest;
import com.example.Authentication.dto.response.RegisterResponse;
import com.example.Authentication.service.AuthService;
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
}