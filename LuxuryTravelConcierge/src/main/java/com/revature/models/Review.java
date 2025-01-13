package com.revature.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer reviewId;


    private String body;

    private int rating;

    @ManyToOne(cascade=CascadeType.REMOVE)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="userId")
    private User user;

    @ManyToOne(cascade=CascadeType.REMOVE)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="hotelId")

    private Hotel hotel;

    @ManyToOne
    @JoinColumn(name = "parent_review_id")
    @JsonBackReference // Prevent circular references
    private Review parentReview;

    @OneToMany(mappedBy = "parentReview", cascade = CascadeType.ALL, orphanRemoval = true)
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

    public Integer getReviewId() {
        return reviewId;
    }


    public void setReviewId(Integer reviewId) {

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
