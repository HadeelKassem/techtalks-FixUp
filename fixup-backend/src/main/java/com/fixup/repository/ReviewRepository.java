package com.fixup.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fixup.model.Review;
import com.fixup.model.ServiceRequest;
import com.fixup.model.User;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProvider(User provider);

    // Used to block a client from reviewing the same booking twice.
    Optional<Review> findByRequest(ServiceRequest request);
}