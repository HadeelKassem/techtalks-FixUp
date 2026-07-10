package com.fixup.service;

import com.fixup.dto.request.LoginRequest;
import com.fixup.dto.request.RegisterRequest;
import com.fixup.dto.response.LoginResponse;
import com.fixup.dto.response.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

}