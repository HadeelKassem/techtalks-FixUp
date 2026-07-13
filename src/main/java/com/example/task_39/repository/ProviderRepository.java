package com.example.task_39.repository;

import com.example.task_39.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {

    List<Provider> findByNameContainingIgnoreCase(String name);

    List<Provider> findByLocationContainingIgnoreCase(String location);

    List<Provider> findByServiceId(Long serviceId);

}