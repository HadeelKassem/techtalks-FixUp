package com.fixup.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fixup.dto.PublicProviderDto;
import com.fixup.service.PublicProviderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/provider")
@RequiredArgsConstructor
public class PublicProviderController {

    private final PublicProviderService publicProviderService;

    @GetMapping
    public ResponseEntity<List<PublicProviderDto>> getAllProviders() {
        List<PublicProviderDto> providers = publicProviderService.getAllProviders();
        return ResponseEntity.ok(providers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicProviderDto> getProviderById(@PathVariable Long id) {
        PublicProviderDto provider = publicProviderService.getProviderById(id);
        return ResponseEntity.ok(provider);
    }

    @GetMapping("/{id}/rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long id) {
    double avgRating = publicProviderService.getAverageRating(id);
    return ResponseEntity.ok(avgRating);
}
}