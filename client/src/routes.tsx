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
      { path: '/about', element: <AboutUsPage /> },
      { path: '/admin/reviews', element: <AdminReviewsPage /> },
      { path: '/admin/banned-users', element: <AdminBannedUsersPage /> },
    ],
  },
];

export default routes;
