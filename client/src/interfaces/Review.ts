export interface Review {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO date string
}
export interface ReviewPayload {
  bookingId: string;
  rating: number;
  comment: string;
}
