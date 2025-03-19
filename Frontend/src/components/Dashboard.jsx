import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/auth.services.js';
import { FaUsers, FaMoneyBill, FaHome, FaUndo } from 'react-icons/fa'; // Icons for cards

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    myRoommates: [],
    myPayments: [],
    myRooms: [],
    requestedRefunds: [],
  });

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

      {/* Grid Layout for Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* My Roommates Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <FaUsers className="text-2xl text-[#4CAF50] mr-2" />
            <h2 className="text-xl font-semibold">My Roommates</h2>
          </div>
          {dashboardData.myRoommates?.length > 0 ? (
            <ul>
              {dashboardData.myRoommates[0].myRoommates?.map((roommate, index) => (
                <li key={index} className="mb-2">
                  <p className="text-gray-700">{roommate?.user?.fullName}</p>
                  <p className="text-sm text-gray-500">{roommate?.user?.email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No roommates found.</p>
          )}
        </div>

        {/* My Payments Card */}
        {/* <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <FaMoneyBill className="text-2xl text-[#4CAF50] mr-2" />
            <h2 className="text-xl font-semibold">My Payments</h2>
          </div>
          {dashboardData.myPayments?.length > 0 ? (
            <ul>
              {dashboardData.myPayments.map((payment, index) => (
                <li key={index} className="mb-2">
                  <p className="text-gray-700">Amount: ${payment?.amount}</p>
                  <p className="text-sm text-gray-500">Date: {payment?.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No payments found.</p>
          )}
        </div> */}

        {/* My Rooms Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <FaHome className="text-2xl text-[#4CAF50] mr-2" />
            <h2 className="text-xl font-semibold">My Rooms</h2>
          </div>
          {dashboardData.myRooms?.length > 0 ? (
            <ul>
              {dashboardData.myRooms[0]?.rooms.map((room, index) => (
                <li key={index} className="mb-2">
                  <p className="text-gray-700">{room.category}</p>
                  <p className="text-sm text-gray-500">Price: ${room.price}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No rooms found.</p>
          )}
        </div>

        {/* My Refunds Card */}
        {/* <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <FaUndo className="text-2xl text-[#4CAF50] mr-2" />
            <h2 className="text-xl font-semibold">My Refunds</h2>
          </div>
          {dashboardData.requestedRefunds?.length > 0 ? (
            <ul>
              {dashboardData.requestedRefunds[0].map((refund, index) => (
                <li key={index} className="mb-2">
                  <p className="text-gray-700">Amount: ${refund.amount}</p>
                  <p className="text-sm text-gray-500">Status: {refund.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No refunds requested.</p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;