import { Layout, LayoutNoFooter } from './layouts';
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
import SchedulePage from './pages/SchedulePage';
import InboxPage from './pages/InboxPage';
import ContactPage from './pages/ContactPage';
import HelpCenterPage from './pages/HelpCenterPage';
import FaqPage from './pages/FaqPage';
import CareersPage from './pages/CareersPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

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
      { path: '/schedule', element: <SchedulePage /> },
      { path: '/my-services', element: <MyServicesPage /> },
      { path: '/my/services/:id', element: <MyServiceDetailsPage /> },
      { path: '/bookings', element: <BookingsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/profile/:id', element: <UserProfilePage /> },
      { path: '/about', element: <AboutUsPage /> },
      { path: '/admin/reviews', element: <AdminReviewsPage /> },
      { path: '/admin/banned-users', element: <AdminBannedUsersPage /> },
      { path: '/admin/pending-services', element: <AdminServicesPage /> },
      { path: '/admin/users', element: <AdminAllUsersPage /> },
      { path: '/admin/dashboard', element: <AdminDashboardPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/help', element: <HelpCenterPage /> },
      { path: '/faq', element: <FaqPage /> },
      { path: '/careers', element: <CareersPage /> },
      { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
      { path: '/terms-of-service', element: <TermsOfServicePage /> },
    ],
  },
  {
    element: <LayoutNoFooter />,
    children: [{ path: '/inbox', element: <InboxPage /> }],
  },
];

export default routes;
