import api from './api';
import { urls } from './urls';
import { BookingPayload, BookingStatus } from '../interfaces';

export const bookService = async (serviceId: string, data: BookingPayload) => {
  const response = await api.post(urls.bookings.book(serviceId), data);
  return response.data;
};

export const getUserBookings = async (userId: string) => {
  const response = await api.get(urls.bookings.getUserBookings(userId));
  return response.data;
};

export const getProviderBookings = async (providerId: string) => {
  const response = await api.get(urls.bookings.getProviderBookings(providerId));
  return response.data;
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
  const response = await api.put(urls.bookings.updateStatus(bookingId, status));
  return response.data;
};
