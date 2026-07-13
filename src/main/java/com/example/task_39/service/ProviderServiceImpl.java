package com.example.task_39.service;

import com.example.task_39.entity.Provider;
import com.example.task_39.repository.ProviderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository providerRepository;

    public ProviderServiceImpl(ProviderRepository providerRepository) {
        this.providerRepository = providerRepository;
    }

    @Override
    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    @Override
    public List<Provider> getProvidersByName(String name) {
        return providerRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Provider> getProvidersByLocation(String location) {
        return providerRepository.findByLocationContainingIgnoreCase(location);
    }

    @Override
    public List<Provider> getProvidersByCategory(Long categoryId) {
        return providerRepository.findByServiceId(categoryId);
    }

}