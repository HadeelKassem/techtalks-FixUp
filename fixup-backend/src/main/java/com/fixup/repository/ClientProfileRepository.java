package com.fixup.repository;

import com.fixup.model.ClientProfile;
import com.fixup.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface ClientProfileRepository extends JpaRepository<ClientProfile, Long> {

    
    Optional<ClientProfile> findByUser(User user);

    
    Optional<ClientProfile> findByUserId(Long userId);
}
