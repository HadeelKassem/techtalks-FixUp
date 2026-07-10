package com.fixup.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fixup.model.Review;
import com.fixup.model.User;
import com.fixup.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<Review> getReviewsForProvider(User provider) {
        return reviewRepository.findByProvider(provider);
    }

    public double calculateAverageRating(User provider) {
        List<Review> reviews = getReviewsForProvider(provider);

        if (reviews.isEmpty()) {
            return 0.0; // no reviews yet — avoid dividing by zero
        }

        int sum = 0;
        for (Review review : reviews) {
            sum += review.getRating();
        }

        return (double) sum / reviews.size();
    }

}
