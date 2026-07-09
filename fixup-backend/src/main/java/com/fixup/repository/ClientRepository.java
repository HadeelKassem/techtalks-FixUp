package com.fixup.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fixup.model.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {

}