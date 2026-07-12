package com.example.task_40.service;

import com.example.task_40.dto.ReviewRequest;
import com.example.task_40.dto.ReviewResponse;
import com.example.task_40.entity.Booking;
import com.example.task_40.entity.Provider;
import com.example.task_40.entity.Review;
import com.example.task_40.repository.BookingRepository;
import com.example.task_40.repository.ProviderRepository;
import com.example.task_40.repository.ReviewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class ReviewServiceImpl implements ReviewService {


    @Autowired
    private ReviewRepository reviewRepository;


    @Autowired
    private BookingRepository bookingRepository;


    @Autowired
    private ProviderRepository providerRepository;



    @Override
    public ReviewResponse submitReview(ReviewRequest request) {


        // Find booking
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));



        // Check that the client owns this booking
        if (!booking.getClient().getId()
                .equals(request.getClientId())) {

            throw new RuntimeException(
                    "You can only review providers you booked"
            );
        }



        // Prevent duplicate review
        if (reviewRepository.findByBookingId(request.getBookingId()).isPresent()) {

            throw new RuntimeException(
                    "Review already exists for this booking"
            );
        }



        Review review = new Review();


        review.setRating(request.getRating());

        review.setComment(request.getComment());

        review.setCreatedAt(LocalDateTime.now());


        review.setBooking(booking);

        review.setClient(booking.getClient());

        review.setProvider(booking.getProvider());



        Review savedReview = reviewRepository.save(review);



        // Update provider average rating
        updateProviderRating(booking.getProvider());



        return new ReviewResponse(
                savedReview.getId(),
                savedReview.getRating(),
                savedReview.getComment(),
                savedReview.getCreatedAt(),
                savedReview.getClient().getName()
        );

    }




    @Override
    public List<ReviewResponse> getProviderReviews(Long providerId) {


        List<Review> reviews =
                reviewRepository.findByProviderId(providerId);



        return reviews.stream()
                .map(review -> new ReviewResponse(
                        review.getId(),
                        review.getRating(),
                        review.getComment(),
                        review.getCreatedAt(),
                        review.getClient().getName()
                ))
                .toList();

    }





    private void updateProviderRating(Provider provider) {


        List<Review> reviews =
                reviewRepository.findByProviderId(provider.getId());



        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0);



        provider.setRatingAvg(average);


        providerRepository.save(provider);

    }

}