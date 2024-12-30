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

    private String Content;

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

}
