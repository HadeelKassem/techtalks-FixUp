package com.fixup.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fixup.model.Review;
import com.fixup.model.User;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>   {
    List<Review> findByProvider(User provider);

}
