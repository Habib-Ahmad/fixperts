import api from './api';
import { urls } from './urls';
import { BookingPayload, BookingStatus } from '../interfaces';

export const getBookingById = async (bookingId: string) => {
  const response = await api.get(urls.bookings.getById(bookingId));
  return response.data;
};

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

export const sendQuote = async (bookingId: string, price: number) => {
  const response = await api.post(urls.bookings.sendQuote(bookingId, price));
  return response.data;
};

export const payForBooking = async (bookingId: string) => {
  const response = await api.post(urls.bookings.pay(bookingId));
  return response.data;
};
