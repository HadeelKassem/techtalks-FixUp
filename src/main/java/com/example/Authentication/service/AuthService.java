package com.example.Authentication.service;

import com.example.Authentication.dto.request.RegisterRequest;
import com.example.Authentication.dto.response.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

}