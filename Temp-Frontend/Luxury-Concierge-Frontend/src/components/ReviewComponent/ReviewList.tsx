// ReviewList.tsx
import { useState, FormEvent } from "react";
import axios from "axios";
import { Review } from "../../interfaces/Review";
import Supplementaries from "../../SupplementaryClass";


interface ReviewListProps {
  reviews: Review[];
  hotelId: number;
  userId?: number;
  onRefresh: () => Promise<void>; // Callback to re-fetch from the parent
}

function ReviewList({ reviews, hotelId, userId, onRefresh }:ReviewListProps) {
  return (
    <div style={{ marginLeft: "1rem" }}>
      {reviews.map((review) => (
        <ReviewItem
          key={review.reviewId}
          review={review}
          hotelId={hotelId}
          userId={userId}
          onRefresh={onRefresh}
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
  onRefresh: () => Promise<void>; // Callback to re-fetch from the parent
}

/**
 * Displays a single review along with a button to reply,
 * and recursively shows any nested replies.
 */
function ReviewItem({ review, hotelId, userId, onRefresh } : ReviewItemProps) {
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
      await axios.post(`${Supplementaries.serverLink}reviews`, replyPayload);
      await onRefresh();
      // reset the form and hide it:
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

      <button onClick={() => setShowReplyForm(!showReplyForm)}>
        {showReplyForm ? "Cancel Reply" : "Reply"}
      </button>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} style={{ marginTop: "0.5rem" }}>
          <div>
            <label>Reply Body:</label> <br></br>
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
        <ReviewList 
          reviews={replies} 
          hotelId={hotelId} 
          userId={userId} 
          onRefresh={onRefresh} 
        />
      )}
    </div>
  );
};
