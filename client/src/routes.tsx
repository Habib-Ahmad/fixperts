import { Layout } from './layouts';
import AboutUsPage from './pages/AboutUs';
import BookingsPage from './pages/BookingsPage';
import CreateServicePage from './pages/CreateServicePage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyServiceDetailsPage from './pages/MyServiceDetailsPage';
import MyServicesPage from './pages/MyServicesPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import ServicesPage from './pages/ServicesPage';
import SignupPage from './pages/SignupPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import AdminBannedUsersPage from './pages/AdminBannedUsers';
import AdminServicesPage from './pages/AdminServicesPage';
import UserProfilePage from './pages/UserProfile';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAllUsersPage from './pages/AdminAllUsersPage';
import path from 'path';

const routes = [
  {
    element: <Layout />,
    children: [
      { path: '*', element: <NotFoundPage /> },
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/services', element: <ServicesPage /> },
      { path: '/services/:id', element: <ServiceDetailsPage /> },
      { path: '/services/create', element: <CreateServicePage /> },
      { path: '/my-services', element: <MyServicesPage /> },
      { path: '/my/services/:id', element: <MyServiceDetailsPage /> },
      { path: '/bookings', element: <BookingsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/profile/:id', element: <UserProfilePage /> },
      { path: '/about', element: <AboutUsPage /> },
      { path: '/admin/reviews', element: <AdminReviewsPage />},
      { path: '/admin/banned-users', element: <AdminBannedUsersPage /> },
      { path: '/admin/pending-services', element: <AdminServicesPage /> },
      { path: '/admin/users', element: <AdminAllUsersPage /> },
      { path: '/admin/dashboard', element: <AdminDashboardPage /> },
    ],
  },
];

export default routes;
