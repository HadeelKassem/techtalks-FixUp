package com.fixup.controller;

import com.fixup.dto.PublicProviderDto;
import com.fixup.service.PublicProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
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
}