import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutBtn from './LogoutBtn.jsx';
import { Logo } from '../index.js';
import { MdHome, MdGroup, MdAddBox, MdFavorite, MdPerson, MdMessage, MdNotifications } from "react-icons/md";

function Header() {
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const isAdmin = userData && userData.role === 'admin';

  const navItems = [
    { name: 'Rooms', slug: '/rooms', active: authStatus, icon: <MdHome /> },
    { name: 'Roommates', slug: '/roommates', active: authStatus, icon: <MdGroup /> },
    { name: 'List Room', slug: '/rooms/add', active: authStatus, icon: <MdAddBox /> },
    { name: 'Favourites', slug: '/favourites/myfavourites', active: authStatus, icon: <MdFavorite /> },
    { name: 'messages', slug: '/messages/ib', active: authStatus, icon: <MdMessage /> },
    { name: 'notifications', slug: '/notifications', active: authStatus, icon: <MdNotifications /> },
  ];

  return (
    <header className="bg-[#F2F4F7] sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-[#2C2C2C]">
          <Logo />
        </div>

        {/* Navigation Items */}
        <ul className="flex space-x-6 items-center">
          {navItems.map(
            (item) =>
              item.active && (
                <li key={item.slug}>
                  <button
                    title={item.name} // Displays a tooltip on hover
                    onClick={() => navigate(item.slug)}
                    className={`inline-block px-4 py-2 duration-200 text-[#6C48E3] rounded-lg ${location.pathname === item.slug
                        ? 'bg-[#6C48E3] text-white hover:bg-[#6C48E3] hover:text-white' // Active state
                        : 'bg-[#F2F4F7] text-[#131038] hover:bg-[#6C48E3] hover:text-white' // Inactive state
                      }`}
                  >
                    {item.icon}
                  </button>

                </li>
              )
          )}
          {authStatus && (
            <li>
              <button
                onClick={() => navigate('/users/myprofile')}
                className={`inline-bock px-4 py-2 duration-200 text-[#6C48E3] bg-[#F2F4F7] rounded-lg hover:bg-[#6C48E3] hover:text-white' ${location.pathname === '/users/myprofile'
                    ? 'bg-[#6C48E3] text-white' // Active state
                    : 'text-[#131038] hover:bg-[#6C48E3] hover:text-white' // Inactive state
                  }`}
              >
                <MdPerson />
              </button>
            </li>
          )}
          {authStatus && (
            <li>
              <LogoutBtn />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;