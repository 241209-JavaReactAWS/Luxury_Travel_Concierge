package com.revature.services;

import com.revature.DAOS.ReviewDAO;
import com.revature.models.Review;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewService {
    private ReviewDAO reviewDAO;

    @Autowired
    public ReviewService(ReviewDAO reviewDAO){
        this.reviewDAO = reviewDAO;
    }

    private List<Review> getReplies(Review review){
        List<Review> replies = reviewDAO.findByParentReview(review);
        for(Review reply : replies){
            reply.setReplies(getReplies(reply));
        }
        return replies;
    }

    public Review getReviewWithReplies(Long parentReviewId){
        Review parentReview = reviewDAO.findById(parentReviewId).orElse(null);

        if( parentReview != null){
            List<Review> childReviews  = reviewDAO.findByParentReview(parentReview);
            for(Review childReview : childReviews){
                childReview.setReplies(getReplies(childReview));
            }

            parentReview.setReplies(childReviews);
        }

        return parentReview;
    }


}
