import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutBtn from './LogoutBtn.jsx';
import { Logo } from '../index.js';
import { MdHome, MdGroup, MdAddBox, MdFavorite, MdPerson, MdChat, MdNotifications, MdMenu } from "react-icons/md";
import authService from '../../services/auth.services.js';
import {Authloader} from '../index.js';
import notificationService from '../../services/notification.services.js';


function Header({ isNotification,unreadMessages,unreadNotifications,fetchNotifications }) {
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const isAdmin = userData && userData.role === 'admin';
  const [popUp, setPopUp] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navItems = [
    { name: 'Rooms', slug: '/rooms', active: authStatus, icon: <MdHome /> },
    { name: 'Roommates', slug: '/roommates', active: authStatus, icon: <MdGroup /> },
    { name: 'List Room', slug: '/rooms/add', active: authStatus, icon: <MdAddBox /> },
    { name: 'Favourites', slug: '/favourites/myfavourites', active: authStatus, icon: <MdFavorite />  },
    { name: 'messages', slug: '/messages/ib', active: authStatus, icon: <MdChat /> },
    // { name: 'Profile', slug: '/users/myprofile', active: authStatus, icon: <MdPerson /> },
  ];

  const mobileNavItems = [
    { name: 'Rooms', slug: '/rooms', active: authStatus, icon: <MdHome /> },
    { name: 'Roommates', slug: '/roommates', active: authStatus, icon: <MdGroup /> },
    { name: 'List Room', slug: '/rooms/add', active: authStatus, icon: <MdAddBox /> },
    { name: 'messages', slug: '/messages/ib', active: authStatus, icon: <MdChat /> },
  ]

  const markAsRead = async () => {
    try {
      isNotification();
      const response = await notificationService.readNotification();
      if (response) {
        fetchNotifications();
      }
    } catch (error) {
      console.log(error);
    } 
  }

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await authService.deleteUserAccount();
      if(response){
        navigate('/users/signup');
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const clearNav= () => {
    setPopUp(false);
    setShowDeleteConfirm(false);
  }

  if (error && typeof error === 'string') {
    return <div className="text-red-500">Error Occured: {error}</div>;
  }

  return !loading ?(
    <header className="bg-[#F2F4F7] sticky top-0 z-50 ">
      <div className="text-2xl font-bold text-[#2C2C2C] block md:hidden flex items-center justify-between px-6 py-4">
          <Logo msg='Room Bazar'/> 
    {authStatus &&(<div className='flex items-center text-[#6C48E3]'>
      <MdMenu className='cursor-pointer' onClick={() => setPopUp(!popUp)}/>
    </div>)}
        </div>
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="hidden md:block text-2xl font-bold text-[#2C2C2C]">
          <Logo />
        </div>

        {/* Navigation Items */}
        <ul className="space-x-6 items-center hidden md:flex">
          {navItems.map(
  (item) =>
    item.active && (
      <li key={item.slug} className="relative">
        <button
          title={item.name}
          onClick={() => navigate(item.slug)}
          className={`inline-block px-4 py-2 duration-200 text-[#6C48E3] rounded-lg ${
            location.pathname === item.slug
              ? 'bg-[#6C48E3] text-white hover:bg-[#6C48E3] hover:text-white'
              : 'bg-[#F2F4F7] text-[#131038] hover:bg-[#6C48E3] hover:text-white'
          }`}
        >
          {item.icon}
          {item.name === 'messages' && unreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {unreadMessages}
            </span>
          )}
        </button>
      </li>
    )
)}
          {
            authStatus && (
              <li>
                <button
                  title='Notifications' // Displays a tooltip on hover
                  onClick={markAsRead}
                  className={`inline-block px-4 py-2 duration-200 text-[#6C48E3] rounded-lg ${location.pathname === '/notifications'
                    ? 'bg-[#6C48E3] text-white hover:bg-[#6C48E3] hover:text-white' // Active state
                    : 'bg-[#F2F4F7] text-[#131038] hover:bg-[#6C48E3] hover:text-white' // Inactive state
                    }`}
                >
                  <MdNotifications />
                </button>
              </li>
            )
          }
          {authStatus && (
            //here profile picture which on click will open pop up on top right in which there is at top the a name with profile picture of loged in user then logout button then delete account button
            <li>
              <div className='rounded-full w-10 h-10 cursor-pointer' onClick={() => setPopUp(!popUp)}>
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </li>
          )}
        </ul>

        <ul className="flex space-x-6 items-center md:hidden">
          {mobileNavItems.map(
            (item) =>
              item.active && (
                <li key={item.slug}>
                  {item.name === 'messages' && unreadMessages > 0 && (
                  
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadMessages}
                      </span>
                  )}
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
          {
            authStatus && (
              <li>
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
                <button
                  title='Notifications' // Displays a tooltip on hover
                  onClick={() => (isNotification())}
                  className={`inline-block px-4 py-2 duration-200 text-[#6C48E3] rounded-lg ${location.pathname === '/notifications'
                    ? 'bg-[#6C48E3] text-white hover:bg-[#6C48E3] hover:text-white' // Active state
                    : 'bg-[#F2F4F7] text-[#131038] hover:bg-[#6C48E3] hover:text-white' // Inactive state
                    }`}
                >
                  <MdNotifications />
                </button>
              </li>
            )
          }
        
        </ul>
      </nav>
      {
        popUp && (
          <div className="fixed top-36 right-0 h-[calc(50vh-4rem)] w-80 bg-[#F2F4F7] shadow-lg border-l border-gray-200 z-30 overflow-y-auto transform transition-all duration-200 ease-in-out md:top-16">
            {/* Profile Header */}
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3 bg-[#F2F4F7] cursor-pointer hover:bg-gray-200" onClick={
              () => {
                navigate('/users/myprofile');
                setPopUp(false);
              }
            }>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#6C48E3] cursor-pointer">
                <img
                  src={userData?.avatar || '/default-avatar.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-lg font-semibold">{userData?.fullName}</h1>
            </div>

             
            <div className="p-4 space-y-3">

              <LogoutBtn clearNav={clearNav}/>

              <button
              className="inline-bock px-6 py-2 duration-200 text-[#6C48E3] bg-[#F2F4F7] border border-[#6C48E3] rounded-lg hover:bg-[#6C48E3] hover:text-white flex items-center gap-2 w-full justify-center"
              onClick={
                ()=>{
                navigate('/favourites/myfavourites')
                setPopUp(false)
                }
              }
              >
                <MdFavorite className="text-2xl text-[#6C48E3] mr-2" /><p>Favourites</p>
              </button>

              <button
                className="w-full py-2 px-4 bg-white text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                onClick={() => {
                  // Handle delete account confirmation
                  setShowDeleteConfirm(true);
                  setPopUp(false);
                }}
              >
                Delete Account
              </button>
            </div>

            {/* Settings Section */}
            {/* <div className="p-4 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Settings</h4>
        <ul className="space-y-2">
          <li>
            <Link 
              to="/settings" 
              className="block py-1 text-gray-700 hover:text-[#6C48E3]"
              onClick={() => setPopUp(false)}
            >
              Account Settings
            </Link>
          </li>
          <li>
            <Link 
              to="/privacy" 
              className="block py-1 text-gray-700 hover:text-[#6C48E3]"
              onClick={() => setPopUp(false)}
            >
              Privacy Settings
            </Link>
          </li>
        </ul>
      </div> */}
          </div>
        )
      }

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-medium mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to permanently delete your account? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  ):(
<Authloader fullScreen={true} message='deleting your account...'/>
  )
}

export default Header;