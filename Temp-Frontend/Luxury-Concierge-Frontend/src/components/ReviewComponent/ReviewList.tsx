// ReviewList.tsx
import React, { useState, FormEvent } from "react";
import axios from "axios";
import { Review } from "../../interfaces/Review";

const API_BASE_URL = "http://localhost:8080";

interface ReviewListProps {
  reviews: Review[];
  hotelId: number;
  userId?: number;
}

function ReviewList({ reviews, hotelId, userId }:ReviewListProps) {
  return (
    <div style={{ marginLeft: "1rem" }}>
      {reviews.map((review) => (
        <ReviewItem
          key={review.reviewId}
          review={review}
          hotelId={hotelId}
          userId={userId}
        />
      ))}
    </div>
  );
};

export default ReviewList;

interface ReviewItemProps {
  review: Review;
  hotelId: number;
  userId?: number;
}

/**
 * Displays a single review along with a button to reply,
 * and recursively shows any nested replies.
 */
function ReviewItem({ review, hotelId, userId } : ReviewItemProps) {
  const { reviewId, body, rating, replies } = review;

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [replyRating, setReplyRating] = useState(5);

  /**
   * Handle form submission for a reply.
   */
  const handleReplySubmit = async (e: FormEvent) => {
    e.preventDefault();

    const replyPayload = {
      body: replyBody,
      rating: replyRating,
      user: userId ? { userId } : undefined,
      hotel: { hotelId },
      parentReview: { reviewId }, // This references the parent
    };

    try {
      await axios.post(`${API_BASE_URL}/reviews`, replyPayload);
      // In a real app, you might re-fetch the reviews so the new reply appears immediately.
      // For simplicity, we'll just reset the form and hide it.
      setReplyBody("");
      setReplyRating(5);
      setShowReplyForm(false);
    } catch (err) {
      console.error("Failed to create reply:", err);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", margin: "0.5rem 0", padding: "0.5rem" }}>
      <p>Review ID: {reviewId}</p>
      <p>Body: {body}</p>
      <p>Rating: {rating}</p>

      <button onClick={() => setShowReplyForm((prev) => !prev)}>
        {showReplyForm ? "Cancel Reply" : "Reply"}
      </button>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} style={{ marginTop: "0.5rem" }}>
          <div>
            <label>Reply Body:</label>
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Rating:</label>
            <input
              type="number"
              value={replyRating}
              min={1}
              max={5}
              onChange={(e) => setReplyRating(parseInt(e.target.value))}
              required
            />
          </div>
          <button type="submit">Submit Reply</button>
        </form>
      )}

      {/* Recursive display of any child replies */}
      {replies && replies.length > 0 && (
        <ReviewList reviews={replies} hotelId={hotelId} userId={userId} />
      )}
    </div>
  );
};
