import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components';

const LayoutNoFooter = () => {
  const location = useLocation();
  const routesWithoutNavbar = ['/login', '/signup'];

  if (routesWithoutNavbar.includes(location.pathname)) {
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
      {/* Footer intentionally omitted */}
    </div>
  );
};

export default LayoutNoFooter;
