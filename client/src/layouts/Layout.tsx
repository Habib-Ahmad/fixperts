import { Outlet, useLocation } from 'react-router-dom';
import { Navbar, Footer } from '../components';

const Layout = () => {
  const location = useLocation();
  const routesWithoutHeaderFooter = ['/login', '/signup'];

  if (routesWithoutHeaderFooter.includes(location.pathname)) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
