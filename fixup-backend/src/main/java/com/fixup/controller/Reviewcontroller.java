package com.fixup.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.fixup.dto.Reviewresponsedto;
import com.fixup.dto.SubmitReviewRequest;
import com.fixup.model.Review;
import com.fixup.model.ServiceRequest;
import com.fixup.model.User;
import com.fixup.repository.ProviderProfileRepository;
import com.fixup.repository.ServiceRequestRepository;
import com.fixup.repository.UserRepository;
import com.fixup.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class Reviewcontroller {

    private final ReviewService reviewService;
    private final ServiceRequestRepository serviceRequestRepository;
    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;

    // POST /api/bookings/{bookingId}/review — client submits a review for a
    // completed booking. Mirrors the ownership/status checks already used
    // for completion/messages elsewhere in the controller layer.
    @PostMapping("/api/bookings/{bookingId}/review")
    public ResponseEntity<?> submitReview(
            @PathVariable Long bookingId,
            @Valid @RequestBody SubmitReviewRequest body,
            Authentication authentication) {

        User client = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ServiceRequest request = serviceRequestRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (request.getClient() == null || !request.getClient().getId().equals(client.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only review your own bookings");
        }

        if (!"COMPLETED".equalsIgnoreCase(String.valueOf(request.getStatus()))) {
            return ResponseEntity.badRequest()
                    .body("You can only review a completed booking");
        }

        Review review = reviewService.createReview(request, client, body);

        return ResponseEntity.status(HttpStatus.CREATED).body(review.getId());
    }

    // GET /api/providers/{providerId}/reviews — public list of reviews for
    // a provider, shown on PublicProviderProfile.jsx.
    // providerId here is the ProviderProfile id (matches how
    // PublicProviderController already looks providers up by id).
    @GetMapping("/api/providers/{providerId}/reviews")
    public ResponseEntity<List<Reviewresponsedto>> getProviderReviews(@PathVariable Long providerId) {

        User providerUser = providerProfileRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"))
                .getUser();

        return ResponseEntity.ok(reviewService.getReviewsForProviderDto(providerUser));
    }
}