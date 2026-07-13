package com.example.task_39.service;

import com.example.task_39.entity.Provider;
import java.util.List;

public interface ProviderService {

    List<Provider> getAllProviders();

    List<Provider> getProvidersByName(String name);

    List<Provider> getProvidersByLocation(String location);

    List<Provider> getProvidersByCategory(Long categoryId);

}