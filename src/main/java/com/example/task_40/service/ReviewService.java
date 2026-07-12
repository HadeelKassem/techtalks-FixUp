package com.example.task_40.service;

import com.example.task_40.dto.ReviewRequest;
import com.example.task_40.dto.ReviewResponse;

import java.util.List;

public interface ReviewService {

    // SCRUM-40 Submit review
    ReviewResponse submitReview(ReviewRequest request);


    // Get all reviews of a provider
    List<ReviewResponse> getProviderReviews(Long providerId);

}