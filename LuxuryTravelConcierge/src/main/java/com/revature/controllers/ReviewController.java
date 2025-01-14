package com.revature.controllers;

import com.revature.models.Review;
import com.revature.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", maxAge=3600, allowCredentials = "true")@RestController
@RequestMapping("reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Review>> getReviewsForHotel(@PathVariable Long hotelId) {
        List<Review> hotelReviewList = reviewService.getAllReviewsForHotelWithReplies(hotelId);
        if(!hotelReviewList.isEmpty()){
            return ResponseEntity.status(201).body(hotelReviewList);
        }else {
            return ResponseEntity.status(404).build();
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewWithReplies(@PathVariable Long id){
        Optional<Review> reviewWithReplies = reviewService.getReviewWithReplies(id);
        return reviewWithReplies.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(404).build());

    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Review> deleteReview(@PathVariable Long id){
        boolean isDeleted = reviewService.deleteReview(id);
        if(isDeleted){
            return ResponseEntity.ok(null);
        }else{
            return ResponseEntity.status(404).build();
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<Review> postReview(@RequestBody Review review){
        Review createdReview = reviewService.createReview(review);
        return ResponseEntity.ok(createdReview);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody String newBody){
        Optional<Review> updatedReview = reviewService.updateReview(id, newBody);
        return updatedReview.map(review -> ResponseEntity.status(201).body(review))
                .orElseGet(() -> ResponseEntity.status(404).build());
    }

}
