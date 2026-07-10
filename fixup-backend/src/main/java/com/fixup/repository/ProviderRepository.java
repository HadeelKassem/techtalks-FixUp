package com.fixup.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fixup.model.Provider;

public interface ProviderRepository extends JpaRepository<Provider, Long> {

}