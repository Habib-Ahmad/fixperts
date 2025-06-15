export interface BookingPayload {
  serviceId: string;
  serviceName: string;
  bookingDate: string;
  description: string;
  price: number;
}

export interface Booking extends BookingPayload {
  id: string;
  serviceId: string;
  customerId: string;
  providerId: string;
  status: BookingStatus;
}

export const bookingStatuses = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
  QUOTED: 'QUOTED',
  PAID: 'PAID',
} as const;
export type BookingStatus = (typeof bookingStatuses)[keyof typeof bookingStatuses];
