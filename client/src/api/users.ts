import { User } from '../interfaces';
import api from './api';
import { urls } from './urls';

export const getLoggedInUser = async () => {
  const response = await api.get(urls.user.getProfile);
  return response.data;
};

export const updateProfile = async (data: Partial<User>) => {
  const response = await api.put(urls.user.updateProfile, data);
  return response.data;
};

export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
  const response = await api.put(urls.user.updateProfile, data);
  return response.data;
};

export const updateProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(urls.user.uploadProfilePicture, formData);

  return response.data;
};
export const getUserById = async (userId: string) => {
  const response = await api.get(urls.user.getById(userId));
  return response.data;
};
