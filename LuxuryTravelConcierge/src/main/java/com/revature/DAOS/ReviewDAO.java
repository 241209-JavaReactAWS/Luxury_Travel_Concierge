package com.revature.DAOS;

import com.revature.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewDAO extends JpaRepository<Review, Long> {
    List<Review> findByParentReview(Review parentReview);
}
