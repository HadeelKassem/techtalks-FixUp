package com.example.myproject2.Service;

import com.example.myproject2.Entity.Provider;

import java.util.List;

public interface ProviderService {

    List<Provider> getProvidersByCategory(Long categoryId);

}