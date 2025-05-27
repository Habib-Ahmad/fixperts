import { Outlet, useLocation } from 'react-router-dom';
import { Navbar, Footer } from '../components';

const Layout = () => {
  const location = useLocation();
  const routesWithoutHeaderFooter = ['/login', '/signup'];

  if (routesWithoutHeaderFooter.includes(location.pathname)) {
    return <Outlet />;
  }

  return (
    <div className="max-w-[1536px] container mx-auto flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <div className="px-[5vw] sm:px-[10vw] py-8">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
