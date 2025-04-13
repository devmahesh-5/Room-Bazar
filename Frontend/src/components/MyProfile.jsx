import React, { useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.services.js';
import { FaUsers, FaEdit, FaHome, FaUndo,FaUserPlus } from 'react-icons/fa'; // Icons for navbar
import RoomCard from './Roomcard.jsx';
import roommateService from '../services/roommate.services.js';
import { RequestCard } from '../components/index.js';
import {Roommateform } from '../components/index.js';
const ProfilePage = () => {
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    myRoommates: [],
    myPayments: [],
    myRooms: [],
    requestedRefunds: [],
  });
  const [sentRequest, setSentRequest] = useState([]);
  const [receivedRequest, setReceivedRequest] = useState([]);
  const [activeSection, setActiveSection] = useState('roommates'); // Default active section
  const [loading, setLoading] = useState(!userData?._id);
  const [myRoommateAccount, setMyRoommateAccount] = useState(null);
  useEffect(() => {
    const isMounted = true;
    setLoading(true);
      (async () => {
        try {
         const [myAccountResponse,myRoommatesResponse] = await Promise.all([
          authService.getCurrentUser(),
          authService.getUserDashboard()
          ])

          if (isMounted) {
            setUserData(myAccountResponse.data[0]);
            setDashboardData(myRoommatesResponse.data);
          }
        } catch (error) {
          setError(error.message);
        }finally{
          isMounted && setLoading(false);
        }
      })();
    
  }, [userData?._id]);

  const fetchSentRequests = useCallback(async () => {
    try {
      const sentRequest = await roommateService.getSentRoommateRequests();
      if (sentRequest) {
        setSentRequest(sentRequest.data);
      }
    } catch (error) {
      setError(error);
    }
  }, [setSentRequest]);
  
  const fetchReceivedRequests = useCallback(async () => {
    try {
      const receivedRequest = await roommateService.getReceivedRoommateRequests();
      if (receivedRequest) {
        setReceivedRequest(receivedRequest.data);
      }
    } catch (error) {
      setError(error);
    }
  }, [setReceivedRequest]);

  const fetchMyRoommateAccount = useCallback(async () => {
    try {
      const myRoommateAccount = await roommateService.getMyRoommateAccount();
      if (myRoommateAccount) {
        setMyRoommateAccount(myRoommateAccount.data);
      }
    } catch (error) {
      setError(error);
    }
  }, [setMyRoommateAccount]);
  
  useEffect(() => {
    if (activeSection === 'sent_requests') {
      fetchSentRequests();
    } else if (activeSection === 'received_requests') {
      fetchReceivedRequests();
    }else if (activeSection === 'edit') {
      fetchMyRoommateAccount();
    }
  }, [activeSection, fetchSentRequests, fetchReceivedRequests,fetchMyRoommateAccount]); // Re-run when `activeSection` changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C48E3]"></div>
        <span className="ml-4 text-lg font-semibold">Loading profile...</span>
      </div>
    );
  }
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Profile Section */}
      <div className="bg-[#F2F4F7] rounded-lg shadow-md overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-gray-200 relative">
          {userData?.coverImage && (
            <img
              src={userData?.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-center space-x-6">
            <img
              src={userData?.avatar}
              alt={userData?.fullName}
              className="w-24 h-24 rounded-full border-4 border-[#F2F4F7] -mt-16"
            />
            <div>
              <h3 className="text-2xl font-bold">{userData?.fullName}</h3>
              <p className="text-gray-500">{userData?.email}</p>
              <p className="text-gray-500">{userData?.phone}</p>
              <p className="text-gray-500">{userData?.address}</p>
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
        {/* <button
          onClick={() => setActiveSection('payments')}
          className={`flex items-center space-x-2 ${activeSection === 'payments' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
        >
          <FaMoneyBill />
          <span>Payments</span>
        </button> */}
        <button
          onClick={() => setActiveSection('rooms')}
          className={`flex items-center space-x-2 ${activeSection === 'rooms' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
        >
          <FaHome />
          <span>Rooms</span>
        </button>
        {/* <button
          onClick={() => setActiveSection('refunds')}
          className={`flex items-center space-x-2 ${activeSection === 'refunds' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
        >
          <FaUndo />
          <span>Refunds</span>
        </button> */}
        <button
          onClick={() => setActiveSection('edit')}
          className={`flex items-center space-x-2 ${activeSection === 'refunds' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
        >
          <FaEdit />
          <span>Edit</span>
        </button>
        <button
          onClick={() => setActiveSection('sent_requests')}
          className={`flex items-center space-x-2 ${activeSection === 'sent_requests' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
        >
          <FaUserPlus />
          <span>sent Requests</span>
        </button>
        <button
          onClick={() => setActiveSection('received_requests')}
          className={`flex items-center space-x-2 ${activeSection === 'received_requests' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
        >
          <FaUserPlus />
          <span>Received Requests</span>
        </button>
      </nav>

      {/* Roommates Section */}
      {activeSection === 'roommates' && (
        <div className="bg-[#F2F4F7] rounded-lg p-4">
          {dashboardData.myRoommates?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {dashboardData.myRoommates?.map((roommate, index) => (
                
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg flex items-center space-x-3 hover:shadow-sm transition-all"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={roommate?.myRoommates?.user?.avatar || '/default-avatar.png'}
                      alt={roommate?.myRoommates?.user?.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png'
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800">{roommate?.myRoommates?.user?.fullName}</p>
                    <p className="text-xs text-gray-500">{roommate?.myRoommates?.user?.email}</p>
                    <p className="text-xs text-gray-500 truncate">{roommate?.myRoommates?.job}</p>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-gray-500">No roommates found</p>
            </div>
          )}
        </div>
      )}

      {/* Payments Section */}
      {activeSection === 'payments' && (
        <div className="bg-[#F2F4F7] rounded-lg shadow-md p-6">
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
        <div className="bg-[#F2F4F7] rounded-lg p-4">
          {dashboardData.myRooms?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.myRooms[0]?.rooms.map((room, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <RoomCard {...room} compact='true' />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="text-gray-500">No rooms found</p>
            </div>
          )}
        </div>
      )}

      {/* Refunds Section */}
      {activeSection === 'refunds' && (
        <div className="bg-[#F2F4F7] rounded-lg shadow-md p-6">
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

      {
        activeSection === 'sent_requests' && (
          <div className="bg-[#F2F4F7] rounded-lg shadow-md p-3">
            {sentRequest?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {sentRequest[0].receiver.map((request, index) => (<div
                  key={index}
                  className="bg-[#F2F4F7] rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <RequestCard
                    fullName={request.user.fullName}
                    _id={request._id}//it is roommate id
                    avatar={request.user.avatar}
                    email={request.user.email}
                    job={request.job}
                    userId={request.user._id}
                    cardType="sent"
                  />
                </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No sent requests found.</p>
            )}
          </div>
        )
      }

      {
        activeSection === 'received_requests' && (
          <div className="bg-[#F2F4F7] rounded-lg shadow-md p-3">
            {receivedRequest?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {receivedRequest[0].sender.map((request, index) => (<div
                  key={index}
                  className="bg-[#F2F4F7] rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <RequestCard
                    fullName={request.user.fullName}
                    _id={request._id}//it is roommate id
                    avatar={request.user.avatar}
                    email={request.user.email}
                    job={request.job}
                    userId={request.user._id}
                    cardType="received"
                  />
                </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No requests found.</p>
            )}
          </div>
        )
      }

      {
        activeSection ==='edit' && (
          <div className="bg-[#F2F4F7] rounded-lg shadow-md p-3">
            < Roommateform  roommate={myRoommateAccount}/>
          </div>
        )
      }
    </div>
  );
};
// remember edit is on user profile not user roommate profile
export default ProfilePage;