package com.fixup.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.fixup.dto.Reviewresponsedto;
import com.fixup.dto.SubmitReviewRequest;
import com.fixup.model.ProviderProfile;
import com.fixup.model.Review;
import com.fixup.model.ServiceRequest;
import com.fixup.model.User;
import com.fixup.repository.ProviderProfileRepository;
import com.fixup.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProviderProfileRepository providerProfileRepository;

    public List<Review> getReviewsForProvider(User provider) {
        return reviewRepository.findByProvider(provider);
    }

    public List<Reviewresponsedto> getReviewsForProviderDto(User provider) {
        return getReviewsForProvider(provider).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
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

    // Called after validating (in the controller/calling service) that:
    // - the requesting user is the client on this booking
    // - the booking status is COMPLETED
    // - no review already exists for this booking
    public Review createReview(ServiceRequest request, User client, SubmitReviewRequest body) {

        if (reviewRepository.findByRequest(request).isPresent()) {
            throw new RuntimeException("This booking has already been reviewed");
        }

        User provider = request.getProvider();
        if (provider == null) {
            throw new RuntimeException("This booking has no provider to review");
        }

        Review review = new Review();
        review.setClient(client);
        review.setProvider(provider);
        review.setRequest(request);
        review.setRating(body.getRating());
        review.setComment(body.getComment());

        Review saved = reviewRepository.save(review);

        syncProviderAverageRating(provider);

        return saved;
    }

    // Keeps ProviderProfile.avgRating (the stored/denormalized field shown
    // in the public provider feed) in sync with the live review average,
    // so PublicProviderService doesn't drift from what /reviews actually shows.
    private void syncProviderAverageRating(User provider) {
        ProviderProfile profile = providerProfileRepository.findByUser(provider).orElse(null);
        if (profile == null) {
            return;
        }
        profile.setAvgRating(calculateAverageRating(provider));
        providerProfileRepository.save(profile);
    }

    private Reviewresponsedto mapToDto(Review review) {
        return new Reviewresponsedto(
                review.getId(),
                review.getClient().getUsername(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}