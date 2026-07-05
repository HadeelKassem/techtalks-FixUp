package com.example.Authentication.service;

import com.example.Authentication.dto.request.LoginRequest;
import com.example.Authentication.dto.request.RegisterRequest;
import com.example.Authentication.dto.response.LoginResponse;
import com.example.Authentication.dto.response.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

}