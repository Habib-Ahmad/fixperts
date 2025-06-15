export interface Review {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  authorId: string;
  targetId: string;
  targetType: 'SERVICE' | 'CLIENT';
  bookingId: string;
}
export interface ReviewPayload {
  bookingId: string;
  rating: number;
  comment: string;
}
