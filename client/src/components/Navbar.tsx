import { useEffect, useState } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Avatar,
  AvatarImage,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '.';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import logo from '@/assets/logo.svg';
import { User } from '../interfaces';
import { getServicesByProviderId } from '../api';

const UserMenu = ({
  user,
  onLogout,
  isMobile = false,
}: {
  user: User | null;
  onLogout: () => void;
  isMobile?: boolean;
}) => {
  if (!user) {
    return (
      <Button className={isMobile ? 'w-full' : ''} asChild>
        <Link to="/login">Login</Link>
      </Button>
    );
  }

  const userName = `${user.firstName} ${user.lastName}`;

  if (isMobile) {
    return (
      <div className="mt-6">
        <p className="text-sm mb-2">{userName}</p>
        <Button variant="outline" className="w-full mb-2" asChild>
          <Link to="/profile">Profile</Link>
        </Button>
        <Button variant="outline" className="w-full mb-2" asChild>
          <Link to="/settings">Settings</Link>
        </Button>
        <Button variant="destructive" className="w-full" onClick={onLogout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={
                user.profilePictureUrl
                  ? `http://localhost:8081${user.profilePictureUrl}`
                  : 'https://github.com/shadcn.png'
              }
              alt={user.firstName}
            />
          </Avatar>
          <span>{userName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState([]);

  const isAdmin = user?.role === 'ADMIN';
  const isProvider = services.length > 0;

  const links = [
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Bookings', path: '/bookings' },
    { name: 'Inbox', path: '/inbox' },
    { name: 'Schedule', path: '/schedule' },
  ];

  if (isProvider) {
    links.push({ name: 'My Services', path: '/my-services' });
  } else {
    links.unshift({ name: 'Become a Provider', path: user ? '/services/create' : '/login' });
  }

  if (isAdmin) {
    links.push({ name: 'Admin Dashboard', path: '/admin/dashboard' });
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServicesByProviderId(user?.id || '');
        setServices(response);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    if (user) {
      fetchServices();
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const NavLinks = () => (
    <ul className="flex flex-col md:flex-row gap-4 md:gap-6">
      {links.map((link) => (
        <li key={link.name}>
          <Link to={link.path} className="text-gray-500 hover:text-black text-sm">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-[10vw] sm:px-[5vw] py-5 shadow-sm bg-white">
      <div className="font-bold text-lg flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          Fixperts
        </Link>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center space-x-6">
        <NavLinks />
        <UserMenu user={user} onLogout={logout} />
      </nav>

      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <NavLinks />
              <UserMenu user={user} onLogout={logout} isMobile />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;