export interface Review {
  id: string;
  serviceId: string;
  bookingId: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: string;  // ISO date string
}