package com.revature.services;

import com.revature.DAOS.ReviewDAO;
import com.revature.models.Review;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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



    public Optional<Review> getReviewWithReplies(Long parentReviewId){
        Optional<Review> parentReview = reviewDAO.findById(parentReviewId);

        if( parentReview.isPresent()){
            List<Review> childReviews  = reviewDAO.findByParentReview(parentReview.get());
            for(Review childReview : childReviews){
                childReview.setReplies(getReplies(childReview));
            }

            parentReview.ifPresent(review -> review.setReplies(childReviews));
        }

        return parentReview;
    }

    public boolean deleteReview(Long reviewId){
        boolean isDeleted = false;
        if(getReview(reviewId).isPresent()){
            reviewDAO.deleteById(reviewId);
            isDeleted = true;
        }
        return isDeleted;
    }

    public Optional<Review> getReview(Long reviewId){
        return reviewDAO.findById(reviewId);
    }

    public Review createReview(Review review){
        return reviewDAO.save(review);
    }

    public Optional<Review> updateReview(Long reviewId, String newBody){
        Optional<Review> updateReview = getReview(reviewId);
        updateReview.ifPresent(review -> {
            review.setBody(newBody);
            reviewDAO.save(review);
        });

        return updateReview;
    }

}
