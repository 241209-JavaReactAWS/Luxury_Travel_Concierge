import {User} from "./User"
import {Hotel} from "./Hotel"

export interface Review {
    reviewId: number;
    body: string;
    rating: number;
    user?: User;
    hotel?: Hotel;
    parentReview?: Review;
    replies: Review[];
  }