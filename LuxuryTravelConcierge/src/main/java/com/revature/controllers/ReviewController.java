package com.revature.controllers;

import com.revature.models.Review;
import com.revature.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewWithReplies(@PathVariable Long id){
        Optional<Review> reviewWithReplies = reviewService.getReviewWithReplies(id);
        return reviewWithReplies.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(404).build());

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Review> deleteReview(@PathVariable Long id){
        boolean isDeleted = reviewService.deleteReview(id);
        if(isDeleted){
            return ResponseEntity.ok(null);
        }else{
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping
    public ResponseEntity<Review> postReview(@RequestBody Review review){
        Review createdReview = reviewService.createReview(review);
        return ResponseEntity.ok(createdReview);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody String newBody){
        Optional<Review> updatedReview = reviewService.updateReview(id, newBody);
        return updatedReview.map(review -> ResponseEntity.status(201).body(review))
                .orElseGet(() -> ResponseEntity.status(404).build());
    }

}
