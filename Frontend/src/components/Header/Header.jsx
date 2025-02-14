import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutBtn from './LogoutBtn.jsx';
import { Logo } from '../index.js';
import { FiMessageCircle } from "react-icons/fi";
import { MdMailOutline, MdFavorite, MdPerson } from "react-icons/md";
function Header() {
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const isAdmin = userData && userData.role === 'admin';
  console.log(authStatus);
  
  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'Rooms', slug: '/rooms', active: true },
    { name: 'Roommates', slug: '/roommates', active: authStatus },
    { name: 'List Room', slug: '/rooms/add', active: authStatus },
    { name: 'Favourites', slug: '/favourites/myfavourites', active: isAdmin },
    { name: 'Login', slug: '/users/login', active: !authStatus },
    { name: 'Signup', slug: '/users/signup', active: !authStatus },
  ];

  return (
    <header className="bg-[#F2F4F7] sticky top-0 z-50">
    <nav className="container mx-auto flex items-center justify-between px-6 py-4">
      {/* Logo */}
      <div className="text-2xl font-bold text-[#2C2C2C]">
        <Logo />
      </div>

      {/* Navigation Items */}
      <ul className="flex space-x-6 items-center"> {/* Ensure items align correctly */}
        {navItems.map(
          (item) =>
            item.active && (
              <li key={item.slug}>
                <button
                  onClick={() => navigate(item.slug)}
                  className={`px-4 py-2 font-medium transition-all duration-300 rounded-md ${
                    location.pathname === item.slug
                      ? 'text-[#131038] font-semibold hover:underline'
                      : 'text-[#131038] hover:underline'
                  }`}
                >
                  {item.name}
                </button>
              </li>
            )
        )}
        {authStatus && (
          <li>
            <LogoutBtn />
          </li>
        //   ,
        //   <li>
        //   <button
        //     onClick={() => navigate('/users/login')}
        //     className={`px-4 py-2 font-medium transition-all duration-300 rounded-md ${
        //       location.pathname === '/users/login'
        //         ? 'text-[#131038] font-semibold hover:underline'
        //         : 'text-[#131038] hover:underline'
        //     }`}
        //   >
        //     <FiMessageCircle />
        //   </button>
        // </li>,
        // <li>
        //    <button
        //     onClick={() => navigate('/users/myprofile')}
        //     className={`px-4 py-2 font-medium transition-all duration-300 rounded-md 
        //     `}
        //   >
        //     <MdPerson />
        //   </button>
        // </li>
        )}
        
      </ul>
    </nav>
  </header>
  );
}

export default Header;
