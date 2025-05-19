import { BookingStatus } from '../interfaces';

export const urls = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
  },
  user: {
    getProfile: '/user/me',
    updateProfile: '/user/me',
    uploadProfilePicture: '/user/me/upload-profile-picture',
  },
  services: {
    create: '/services',
    getAll: '/services',
    getByProvider: (providerId: string) => `/services/provider/${providerId}`,
    getById: (id: string) => `/services/${id}`,
    update: (id: string) => `/services/${id}`,
    uploadMedia: (id: string) => `/services/${id}/upload-media`,
    delete: (id: string) => `/services/${id}`,
  },
  bookings: {
    getById: (id: string) => `/bookings/${id}`,
    getUserBookings: (id: string) => `/bookings/customer/${id}`,
    getProviderBookings: (id: string) => `/bookings/provider/${id}`,
    book: (service: string) => `/bookings/${service}/book`,
    updateStatus: (serviceId: string, status: BookingStatus) =>
      `/bookings/${serviceId}/status?status=${status}`,
    update: (id: string) => `/bookings/update/${id}`,
    delete: (id: string) => `/bookings/delete/${id}`,
  },
};
