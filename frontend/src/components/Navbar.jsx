import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react'  ;

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <NextUINavbar className="bg-slate-900 border-b border-white/10" maxWidth="full">
      <NavbarBrand>
        <RouterLink to="/" className="flex items-center gap-2">
          <Gamepad2 className="text-secondary" />
          <p className="font-bold text-inherit text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500">Bloit</p>
        </RouterLink>
      </NavbarBrand>
      
      <NavbarContent className="hidden sm:flex gap-6 mx-8" justify="center">
        <NavbarItem>
          <RouterLink to="/tournaments" className="text-gray-300 hover:text-white transition-colors">Tournaments</RouterLink>
        </NavbarItem>
        {user && (
          <NavbarItem>
             <RouterLink to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</RouterLink>
          </NavbarItem>
        )}
      </NavbarContent>
      
      <NavbarContent justify="end">
        {user ? (
          <>
            <NavbarItem className="hidden sm:flex text-sm text-gray-400">
              {user.name} ({user.role})
            </NavbarItem>
            <NavbarItem>
              <Button color="danger" variant="flat" onClick={handleLogout}>
                Logout
              </Button>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <RouterLink to="/login" className="text-gray-300 hover:text-white transition-colors">Login</RouterLink>
            </NavbarItem>
            <NavbarItem>
              <Button as={RouterLink} color="secondary" to="/signup" variant="shadow">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};

export default Navbar;
