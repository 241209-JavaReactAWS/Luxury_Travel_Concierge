import { useState, useEffect, FormEvent } from "react";
import { Review } from "../../interfaces/Review";
import ReviewList from "./ReviewList";
import axios from "axios";

// Adjust to match your backend base URL
const API_BASE_URL = "http://localhost:8080";

interface HotelReviewsProps {
  hotelId: number;
  userId?: number; // the current user's ID
}

function HotelReviews({ hotelId, userId }: HotelReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewBody, setNewReviewBody] = useState<string>("");
  const [newReviewRating, setNewReviewRating] = useState<number>(5);

  /**
   * Fetch all reviews for this hotel.
   * Need extra work for backend to make a specific endopoint for a hotel's all reviews
   * that returns a list of Review objects (with nested replies).
   */
  useEffect(() => {
    axios
      .get<Review[]>(`${API_BASE_URL}/hotels/${hotelId}/reviews`)
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch reviews:", err);
      });
  }, [hotelId]);

  /**
   * Handle form submission to create a top-level review.
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
      const response = await axios.post<Review>(
        `${API_BASE_URL}/reviews`,
        newReviewPayload
      );
      // Update local list of reviews
      setReviews((prevReviews) => [response.data, ...prevReviews]);

      // Clear form
      setNewReviewBody("");
      setNewReviewRating(5);
    } catch (error) {
      console.error("Failed to create review:", error);
    }
  };

  return (
    <div>
      <h2>Reviews for Hotel #{hotelId}</h2>

      {/* Form: Create top-level review */}
      <form onSubmit={handleCreateReview}>
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
            value={newReviewRating}
            min={1}
            max={5}
            onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
            required
          />
        </div>

        <button type="submit">Submit Review</button>
      </form>

      {/* Show all reviews (includes nested replies) */}
      <ReviewList reviews={reviews} hotelId={hotelId} userId={userId} />
    </div>
  );
};

export default HotelReviews;
