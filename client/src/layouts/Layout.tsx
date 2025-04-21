import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../components';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow px-[5vw] sm:px-[10vw]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
