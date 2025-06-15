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
    getById: (userId: string) => `/user/${userId}`,
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
    updateStatus: (bookingId: string, status: BookingStatus) =>
      `/bookings/${bookingId}/status?status=${status}`,
    sendQuote: (bookingId: string, price: string | number) =>
      `/bookings/${bookingId}/quote?price=${price}`, // new endpoint for quoting
    pay: (bookingId: string) => `/bookings/${bookingId}/pay`, // new endpoint for payment
    update: (id: string) => `/bookings/update/${id}`,
    delete: (id: string) => `/bookings/delete/${id}`,
  },
  admin: {
    getAllUsers: '/admin/users',
    getUserById: (id: string) => `/admin/users/${id}`,
    updateUser: (id: string) => `/admin/users/${id}`,
    deleteUser: (id: string) => `/admin/users/${id}`,

    getUnvalidatedServices: '/admin/services',
    approveService: (id: string) => `/admin/services/${id}/approve`,
    rejectService: (id: string) => `/admin/services/${id}/reject`,

    getAllReviews: '/admin/reviews',
    deleteReview: (id: string) => `/admin/reviews/${id}`,
  },
  reviews: {
    create: (bookingId: string) => `/reviews/${bookingId}`,
    getByBookingAndAuthor: (bookingId: string, authorId: string) =>
      `/reviews/by-booking-and-author?bookingId=${bookingId}&authorId=${authorId}`,
    getByService: (serviceId: string) => `/reviews/service/${serviceId}`,
    getByClient: (clientId: string) => `/reviews/client/${clientId}`,
    delete: (reviewId: string) => `/reviews/${reviewId}`,
  },
};
