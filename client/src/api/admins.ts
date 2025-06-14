// src/api/admins.ts

import api from './api';
import { User, Service, Review } from '../interfaces';
import { urls } from './urls';

const A = urls.admin;

export const getAllReviews = async (): Promise<Review[]> => {
  const { data } = await api.get<Review[]>(A.getAllReviews);
  return data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await api.delete(A.deleteReview(reviewId));
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>(A.getAllUsers);
  return data;
};

export const banUser = async (id: string): Promise<void> => {
  await api.delete(urls.admin.deleteUser(id));
};

export const unbanUser = async (id: string): Promise<User> => {
  const { data } = await api.put<User>(A.updateUser(id), { isBanned: false });
  return data;
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
  const { data } = await api.put<User>(urls.admin.updateUser(id), updates);
  return data;
};

export const getUnapprovedServices = async (): Promise<Service[]> => {
  const { data } = await api.get<Service[]>(urls.admin.getUnvalidatedServices);
  return data;
};

export const approveService = async (id: string): Promise<void> => {
  await api.put(urls.admin.approveService(id));
};

export const rejectService = async (id: string): Promise<void> => {
  await api.put(urls.admin.rejectService(id));
};

export const getAdminOverview = async (): Promise<Record<string, number>> => {
  const { data } = await api.get('/admin/stats/overview');
  return data;
};

export const getBookingsByDay = async (days = 30): Promise<Record<string, number>> => {
  const { data } = await api.get(`/admin/stats/bookings-by-day?days=${days}`);
  return data;
};
