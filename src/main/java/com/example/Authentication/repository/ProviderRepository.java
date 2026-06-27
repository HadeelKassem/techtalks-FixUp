package com.example.Authentication.repository;

import com.example.Authentication.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderRepository extends JpaRepository<Provider, Long> {

}