package com.revature.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    private String body;

    private int rating;

    @ManyToOne
    @JoinColumn(name="userId")
    private User user;

    @ManyToOne
    @JoinColumn(name="hotelId")
    private Hotel hotel;

    @ManyToOne
    @JoinColumn(name = "parent_review_id")
    @JsonBackReference // Prevent circular references
    private Review parentReview;

    @OneToMany(mappedBy = "parentReview", cascade = CascadeType.ALL)
    @JsonManagedReference // Allow serialization of child reviews
    private List<Review> replies;

    public Review(String body, int rating, User user, Hotel hotel, Review parentReview) {
        this.body = body;
        this.rating = rating;
        this.user = user;
        this.hotel = hotel;
        this.parentReview = parentReview;
    }

    public Review() {
    }

    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Hotel getHotel() {
        return hotel;
    }

    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
    }

    public Review getParentReview() {
        return parentReview;
    }

    public void setParentReview(Review parentReview) {
        this.parentReview = parentReview;
    }

    public List<Review> getReplies() {
        return replies;
    }

    public void setReplies(List<Review> replies) {
        this.replies = replies;
    }
}
