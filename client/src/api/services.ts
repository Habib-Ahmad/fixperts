import { ServicePayload } from '../interfaces';
import api from './api';
import { urls } from './urls';

export const createService = async (serviceData: ServicePayload) => {
  const response = await api.post(urls.services.create, serviceData);
  return response.data;
};

export const updateServiceMedia = async (id: string, mediaUrls: File[]) => {
  const formData = new FormData();
  mediaUrls.forEach((file) => {
    formData.append('files', file);
  });
  console.log('FormData:', formData);
  const response = await api.post(urls.services.uploadMedia(id), formData);
  return response.data;
};

export const getAllServices = async () => {
  const response = await api.get(urls.services.getAll);
  return response.data;
};

export const getServiceById = async (id: string) => {
  const response = await api.get(`${urls.services.getById(id)}`);
  return response.data;
};

export const searchServices = async (params: {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  emergency?: boolean;
  category?: string;
}) => {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.append('query', params.query);
  if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString());
  if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
  if (params.emergency !== undefined) searchParams.append('emergency', String(params.emergency));
  if (params.category) searchParams.append('category', params.category);

  const response = await api.get(`/services/search/advanced?${searchParams.toString()}`);
  return response.data;
};

export const getServicesByProviderId = async (providerId: string) => {
  const response = await api.get(urls.services.getByProvider(providerId));
  return response.data;
};

export const updateService = async (id: string, serviceData: ServicePayload) => {
  const response = await api.put(`${urls.services.update(id)}`, serviceData);
  return response.data;
};

export const deleteService = async (id: string) => {
  const response = await api.delete(`${urls.services.delete(id)}`);
  return response.data;
};
