package com.fixup.repository;

import com.fixup.model.ProviderProfile;
import com.fixup.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Same pattern as ClientProfileRepository.
// Spring generates all the SQL from the method names.
public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {

    Optional<ProviderProfile> findByUser(User user);

    Optional<ProviderProfile> findByUserId(Long userId);
}
