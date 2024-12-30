package com.revature.controllers;

import com.revature.exceptions.*;
import com.revature.models.Review;
import com.revature.services.ReviewService;
import com.revature.models.User;
import com.revature.services.ReviewService;
import com.revature.services.UserSevice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/{id}")
    public Review getReviewWithReplies(@PathVariable Long id){
        return reviewService.getReviewWithReplies(id);
    }

}
