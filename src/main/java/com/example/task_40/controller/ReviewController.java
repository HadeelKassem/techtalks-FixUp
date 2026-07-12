package com.example.task_40.controller;

import com.example.task_40.dto.ReviewRequest;
import com.example.task_40.dto.ReviewResponse;
import com.example.task_40.service.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api")
public class ReviewController {


    @Autowired
    private ReviewService reviewService;



    // SCRUM-40 Submit Review
    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponse> submitReview(
            @RequestBody ReviewRequest request) {


        ReviewResponse response =
                reviewService.submitReview(request);


        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }




    // Get all reviews of a provider
    @GetMapping("/providers/{providerId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getProviderReviews(
            @PathVariable Long providerId) {


        List<ReviewResponse> reviews =
                reviewService.getProviderReviews(providerId);


        return ResponseEntity.ok(reviews);
    }

}