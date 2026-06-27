package com.example.Authentication.service;

import com.example.Authentication.dto.request.RegisterRequest;
import com.example.Authentication.dto.response.RegisterResponse;
import com.example.Authentication.entity.Client;
import com.example.Authentication.entity.Provider;
import com.example.Authentication.repository.ClientRepository;
import com.example.Authentication.repository.ProviderRepository;
import com.example.Authentication.repository.UserRepository;
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
}