package com.example.myproject2.Service;

import com.example.myproject2.Entity.Provider;
import com.example.myproject2.Repository.ProviderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository providerRepository;


    public ProviderServiceImpl(ProviderRepository providerRepository) {
        this.providerRepository = providerRepository;
    }


    @Override
    public List<Provider> getProvidersByCategory(Long categoryId) {

        return providerRepository.findByCategoryId(categoryId);

    }
}