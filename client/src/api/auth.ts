import api from './api';
import { LoginPayload, SignupPayload } from '../interfaces';
import { urls } from './urls';

export const signup = async (data: SignupPayload) => {
  const response = await api.post(urls.auth.signup, data);
  return response.data;
};

export const login = async (data: LoginPayload) => {
  const response = await api.post(urls.auth.login, data);
  return response.data;
};
