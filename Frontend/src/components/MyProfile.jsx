import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import authService from '../services/auth.services.js';
import { FaUsers, FaMoneyBill, FaHome, FaUndo } from 'react-icons/fa'; // Icons for navbar

const ProfilePage = () => {
  const userData = useSelector((state) => state.auth.userData);
  const [dashboardData, setDashboardData] = useState({
    myRoommates: [],
    myPayments: [],
    myRooms: [],
    requestedRefunds: [],
  });
  const [activeSection, setActiveSection] = useState('roommates'); // Default active section

  useEffect(() => {
    (async () => {
      try {
        const response = await authService.getUserDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error getting user dashboard:', error);
      }
    })();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Profile Section */}
      <div className="bg-[#F2F4F7] rounded-lg shadow-md overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-gray-200 relative">
          {userData.coverImage && (
            <img
              src={userData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-center space-x-6">
            <img
              src={userData.avatar}
              alt={userData.fullName}
              className="w-24 h-24 rounded-full border-4 border-[#F2F4F7] -mt-16"
            />
            <div>
              <h3 className="text-2xl font-bold">{userData.fullName}</h3>
              <p className="text-gray-500">{userData.email}</p>
              <p className="text-gray-500">{userData.phone}</p>
              <p className="text-gray-500">{userData.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-[#F2F4F7] shadow-md p-4 flex space-x-6">
        <button
          onClick={() => setActiveSection('roommates')}
          className={`flex items-center space-x-2 ${activeSection === 'roommates' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
        >
          <FaUsers />
          <span>Roommates</span>
        </button>
        <button
          onClick={() => setActiveSection('payments')}
          className={`flex items-center space-x-2 ${activeSection === 'payments' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
        >
          <FaMoneyBill />
          <span>Payments</span>
        </button>
        <button
          onClick={() => setActiveSection('rooms')}
          className={`flex items-center space-x-2 ${activeSection === 'rooms' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
        >
          <FaHome />
          <span>Rooms</span>
        </button>
        <button
          onClick={() => setActiveSection('refunds')}
          className={`flex items-center space-x-2 ${activeSection === 'refunds' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
        >
          <FaUndo />
          <span>Refunds</span>
        </button>
        <button
          onClick={() => setActiveSection('edit')}
          className={`flex items-center space-x-2 ${activeSection === 'refunds' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
        >
          <FaUndo />
          <span>Edit</span>
        </button>
        <button
          onClick={() => setActiveSection('sent_requests')}
          className={`flex items-center space-x-2 ${activeSection === 'sent_requests' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
        >
          <FaUndo />
          <span>sent Requests</span>
        </button>
        <button
          onClick={() => setActiveSection('received_requests')}
          className={`flex items-center space-x-2 ${activeSection === 'received_requests' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
        >
          <FaUndo />
          <span>Received Requests</span>
        </button>
      </nav>

      {/* Roommates Section */}
      {activeSection === 'roommates' && (
        <div className="bg-[#F2F4F7] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">My Roommates</h2>
          {dashboardData.myRoommates?.length > 0 ? (
            <ul>
              {dashboardData.myRoommates[0].myRoommates?.map((roommate, index) => (
                <li key={index} className="mb-4 p-4 bg-[#F2F4F7] rounded-lg">
                    <div className='flex items-center space-x-4'>
                    <img src={roommate?.user?.avatar} alt="User Avatar" className="w-12 h-12 rounded-full object-cover mr-4" />
                  <p className="font-semibold text-gray-700">{roommate?.user?.fullName}</p>
                    </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No roommates found.</p>
          )}
        </div>
      )}

      {/* Payments Section */}
      {activeSection === 'payments' && (
        <div className="bg-[#F2F4F7] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">My Payments</h2>
          {dashboardData.myPayments?.length > 0 ? (
            <ul>
              {dashboardData.myPayments.map((payment, index) => (
                <li key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">Amount: ${payment?.amount}</p>
                  <p className="text-sm text-gray-500">Date: {payment?.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No payments found.</p>
          )}
        </div>
      )}

      {/* Rooms Section */}
      {activeSection === 'rooms' && (
        <div className="bg-[#F2F4F7] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">My Rooms</h2>
          {dashboardData.myRooms?.length > 0 ? (
            <ul>
              {dashboardData.myRooms[0]?.rooms.map((room, index) => (
                <li key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{room.category}</p>
                  <p className="text-sm text-gray-500">Price: ${room.price}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No rooms found.</p>
          )}
        </div>
      )}

      {/* Refunds Section */}
      {activeSection === 'refunds' && (
        <div className="bg-[#F2F4F7] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">My Refunds</h2>
          {dashboardData.requestedRefunds?.length > 0 ? (
            <ul>
              {dashboardData.requestedRefunds[0].map((refund, index) => (
                <li key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">Amount: ${refund.amount}</p>
                  <p className="text-sm text-gray-500">Status: {refund.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No refunds requested.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;