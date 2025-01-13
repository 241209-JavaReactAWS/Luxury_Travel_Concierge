import { useState, useEffect, FormEvent } from "react";
import { Review } from "../../interfaces/Review";
import ReviewList from "./ReviewList";
import axios from "axios";
import Supplementaries from "../../SupplementaryClass";
import "./review.css"

// Adjust to match your backend base URL
const API_BASE_URL = Supplementaries.serverLink;

interface HotelReviewsProps {
  hotelId: number;
  userId?: number; // the current user's ID
}

function HotelReviews({ hotelId, userId }: HotelReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewBody, setNewReviewBody] = useState<string>("");
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [hotelName,setHotelName] = useState<string>("__________");

  /**
   * Fetch all reviews for a hotel, including nested replies.
   * Backend returns a list of Review objects (with nested replies).
   */
  const fetchReviews = async () => {
    try {
      const res = await axios.get<Review[]>(`${API_BASE_URL}reviews/hotel/${hotelId}`,{headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
    }});
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
    axios.get(`${API_BASE_URL}hotel/${hotelId}`,{headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
  }}).then((res) => { setHotelName(res.data.name) });
  }, [hotelId]);

  /**
   * Handle form submission to create a new top-level review on backend.
   * After creation, re-fetch the reviews to display the updated list.
   */
  const handleCreateReview = async (e: FormEvent) => {
    e.preventDefault();
    const newReviewPayload = {
      body: newReviewBody,
      rating: newReviewRating,
      user: userId ? { userId } : undefined,
      hotel: { hotelId: hotelId },
      parentReview: null,
    };
    try {
      await axios.post<Review>(`${API_BASE_URL}reviews`, newReviewPayload,{headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
    }});
      // Re-fetch updated data
      await fetchReviews();
      // Clear form
      setNewReviewBody("");
      setNewReviewRating(5);
    } catch (error) {
      console.error("Failed to create review:", error);
    }
  };

  return (
    <div className="hotel-reviews-container">
      <h2 className="hotel-reviews-header">Reviews for {hotelName}</h2>

      {/* Form: Create a top-level review */}
      <form onSubmit={handleCreateReview} className="review-form">
        <div>
          <label>Review Body:</label>
          <textarea
            value={newReviewBody}
            onChange={(e) => setNewReviewBody(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Rating:</label>
          <input
            type="number"
            className="rating-input"
            value={newReviewRating}
            min={1}
            max={5}
            onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Review
        </button>
      </form>

      {/* Display all reviews and nested replies */}
      <ReviewList 
        reviews={reviews} 
        hotelId={hotelId} 
        userId={userId} 
        onRefresh={fetchReviews} 
      />
    </div>
  );
};

export default HotelReviews;
