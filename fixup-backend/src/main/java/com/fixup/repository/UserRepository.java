package com.fixup.repository;

import com.fixup.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// We need to look up users by email (for auth) and by id (for profile fetching)
// JpaRepository already gives us findById(), so we only add findByEmail()
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring generates: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
}
