package com.fixup.service;

import com.fixup.dto.request.LoginRequest;
import com.fixup.dto.request.RegisterRequest;
import com.fixup.dto.response.LoginResponse;
import com.fixup.dto.response.RegisterResponse;
import com.fixup.model.Client;
import com.fixup.model.Provider;
import com.fixup.model.User;
import com.fixup.repository.ClientRepository;
import com.fixup.repository.ProviderRepository;
import com.fixup.repository.UserRepository;
import com.fixup.security.JwtService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final ProviderRepository providerRepository;

    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (request.getRole().name().equals("CLIENT")) {

            Client client = new Client();

            client.setUsername(request.getUsername());
            client.setEmail(request.getEmail());
            client.setPassword(passwordEncoder.encode(request.getPassword()));
            client.setPhoneNumber(request.getPhoneNumber());
            client.setRole(request.getRole());

            clientRepository.save(client);

        } else {

            Provider provider = new Provider();

            provider.setUsername(request.getUsername());
            provider.setEmail(request.getEmail());
            provider.setPassword(passwordEncoder.encode(request.getPassword()));
            provider.setPhoneNumber(request.getPhoneNumber());
            provider.setRole(request.getRole());
            provider.setDescription(request.getDescription());
            provider.setLocation(request.getLocation());

            providerRepository.save(provider);
        }

        return new RegisterResponse("User registered successfully");
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(token);
    }
}