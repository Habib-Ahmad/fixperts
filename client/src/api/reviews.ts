import api from './api';
import { urls } from './urls';
import { ReviewPayload } from '../interfaces';

// Create a review (client or provider)
export const createReview = async (
  bookingId: string,
  data: { rating: number; comment: string }
) => {
  const response = await api.post(urls.reviews.create(bookingId), data);
  return response.data;
};
// Check if the user already reviewed this booking
export const getReviewByBookingAndAuthor = async (bookingId: string, authorId: string) => {
  const response = await api.get(urls.reviews.getByBookingAndAuthor(bookingId, authorId));
  return response.data;
};

// Get all reviews for a service (used on service detail pages)
export const getReviewsForService = async (serviceId: string) => {
  const response = await api.get(urls.reviews.getByService(serviceId));
  return response.data;
};

// Get all reviews for a client (used on client profile if needed)
export const getReviewsForClient = async (clientId: string) => {
  const response = await api.get(urls.reviews.getByClient(clientId));
  return response.data;
};

// Delete a review (if user is author or admin)
export const deleteReview = async (reviewId: string) => {
  const response = await api.delete(urls.reviews.delete(reviewId));
  return response.data;
};
