package com.example.task_39.controller;

import com.example.task_39.entity.Provider;
import com.example.task_39.service.ProviderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "*")
public class ProviderController {

    private final ProviderService providerService;

    public ProviderController(ProviderService providerService) {
        this.providerService = providerService;
    }

    @GetMapping
    public List<Provider> getAllProviders() {
        return providerService.getAllProviders();
    }

    @GetMapping("/name/{name}")
    public List<Provider> getProvidersByName(@PathVariable String name) {
        return providerService.getProvidersByName(name);
    }

    @GetMapping("/location/{location}")
    public List<Provider> getProvidersByLocation(@PathVariable String location) {
        return providerService.getProvidersByLocation(location);
    }

    @GetMapping("/category/{categoryId}")
    public List<Provider> getProvidersByCategory(@PathVariable Long categoryId) {
        return providerService.getProvidersByCategory(categoryId);
    }
}