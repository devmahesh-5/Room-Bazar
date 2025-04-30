import React, { useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.services.js';
import { FaUsers, FaEdit, FaHome, FaUserPlus,FaBook,FaCalendar } from 'react-icons/fa';
import RoomCard from './Roomcard.jsx';
import roommateService from '../services/roommate.services.js';
import { RequestCard, Roommateform, Profileform, Authloader,MyBookings } from '../components/index.js';
import { Link, useNavigate } from 'react-router-dom';
import bookingService from '../services/booking.services.js';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    myRoommates: [],
    myPayments: [],
    myRooms: [],
    requestedRefunds: [],
  });
  const [sentRequest, setSentRequest] = useState([]);
  const [receivedRequest, setReceivedRequest] = useState([]);
  const [activeSection, setActiveSection] = useState('roommates');
  const [loading, setLoading] = useState(!userData?._id);
  const [myRoommateAccount, setMyRoommateAccount] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  useEffect(() => {
    const isMounted = true;
    setLoading(true);
    (async () => {
      try {
        const [myAccountResponse, myRoommatesResponse] = await Promise.all([
          authService.getCurrentUser(),
          authService.getMyDashboard(),
        ]);

        if (isMounted) {
          setUserData(myAccountResponse.data[0]);
          setDashboardData(myRoommatesResponse.data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        isMounted && setLoading(false);
      }
    })();
  }, [userData?._id]);

  const handleReceivedRequestAccept = async () => {
    fetchReceivedRequests();
  }

  const handleSentRequestCancel = async () => {
    fetchSentRequests();
  }

  const fetchSentRequests = useCallback(async () => {
    try {
      const sentRequest = await roommateService.getSentRoommateRequests();
      if (sentRequest) {
        setSentRequest(sentRequest.data);
      }
    } catch (error) {
      setError(error);
    }
  }, [setSentRequest, handleSentRequestCancel]);

  const fetchReceivedRequests = useCallback(async () => {
    try {
      const receivedRequest = await roommateService.getReceivedRoommateRequests();
      if (receivedRequest) {
        setReceivedRequest(receivedRequest.data);
      }
    } catch (error) {
      setError(error);
    }
  }, [setReceivedRequest, handleReceivedRequestAccept]);

  const handleMyBookings = async (bookingId) => {
    try {
      const checkInBooking = await bookingService.updateBooking(bookingId);
      fetchMyBookings();
    } catch (error) {
      setError(error);
    }
  }

  const fetchMyBookings = useCallback(async () => {
    try {
      const myBookings = await bookingService.getMyBookings();
      if (myBookings) {
        setMyBookings(myBookings.data);
      }
    } catch (error) {
      setError(error);
    }
  }, [setMyBookings, handleMyBookings]);

  useEffect(() => {
    if (activeSection === 'sent_requests') {
      fetchSentRequests();
    } else if (activeSection === 'received_requests') {
      fetchReceivedRequests();
    }else if (activeSection === 'my_bookings') {
      fetchMyBookings();
    }
  }, [activeSection, fetchSentRequests, fetchReceivedRequests]);


  const handleVerifyNow = async () => {
    try {
      setVerifyLoading(true);
      const response = await authService.resendOTP({ email: userData?.email });
      if (response) {
        navigate(`/users/verify-otp/${userData?.email}`);
      }
    } catch (error) {
      setError(error);
  }finally{
    setVerifyLoading(false);
  }
  }

  console.log(userData);
  


  if (loading) {
    return <Authloader message="Loading Profile" />;
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7]">
    {/* Profile Header */}
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover Image */}
      <div className="h-48 bg-[#F2F4F7] relative">
        {userData?.coverImage ? (
          <img
            src={userData?.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.className = "w-full h-full bg-[#F2F4F7]";
            }}
          />
        ) : (
          <div className="w-full h-full bg-[#F2F4F7] "></div>
        )}
      </div>
  
      {/* Profile Info */}
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              <img
                src={userData?.avatar}
                alt={userData?.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.className = "w-full h-full bg-gradient-to-r from-gray-200 to-gray-300";
                }}
              />
            </div>
          </div>
  
          {/* Profile Details */}
          <div className="flex-1 space-y-2 mt-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userData?.fullName}</h1>
                <div className={`text-[#6C48E3] px-1 py-1 text-sm font-medium rounded-full flex items-center}`}>
                {userData?.is_verified ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="#6C48E3" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Account
                  </span>
                ) : verifyLoading ? ( <button disabled className="cursor-not-allowed bg-[#6C48E3] text-white px-3 py-1 rounded-full text-sm font-medium">Sending OTP...</button>) : (
                    <button 
                      onClick={handleVerifyNow}
                      className="bg-[#6C48E3] text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      Verify Now
                    </button>
                )}
              </div>
                <p className="text-gray-600 px-3">{userData?.role || 'Member'}</p>
              </div>
              
              {/* Verification Status - Highlighted */}
             
  
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h3>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {userData?.email}
                  </p>
                  {userData?.phone && (
                    <p className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {userData.phone}
                    </p>
                  )}
                </div>
              </div>
  
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                {userData?.address ? (
                  <p className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {userData.address}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">No address provided</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveSection('roommates')}
              className={`flex items-center px-4 py-3 border-b-2 ${activeSection === 'roommates' ? 'border-[#6C48E3] text-[#6C48E3]' : 'border-transparent text-gray-600 hover:text-[#6C48E3]'}`}
            >
              <FaUsers className="mr-2" />
              <span>Roommates</span>
            </button>
            <button
              onClick={() => setActiveSection('rooms')}
              className={`flex items-center px-4 py-3 border-b-2 ${activeSection === 'rooms' ? 'border-[#6C48E3] text-[#6C48E3]' : 'border-transparent text-gray-600 hover:text-[#6C48E3]'}`}
            >
              <FaHome className="mr-2" />
              <span>Rooms</span>
            </button>
            <button
              onClick={() => setActiveSection('edit_profile')}
              className={`flex items-center px-4 py-3 border-b-2 ${activeSection === 'edit_profile' ? 'border-[#6C48E3] text-[#6C48E3]' : 'border-transparent text-gray-600 hover:text-[#6C48E3]'}`}
            >
              <FaEdit className="mr-2" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setActiveSection('sent_requests')}
              className={`flex items-center px-4 py-3 border-b-2 ${activeSection === 'sent_requests' ? 'border-[#6C48E3] text-[#6C48E3]' : 'border-transparent text-gray-600 hover:text-[#6C48E3]'}`}
            >
              <FaUserPlus className="mr-2" />
              <span>Sent Requests</span>
            </button>
            <button
              onClick={() => setActiveSection('received_requests')}
              className={`flex items-center px-4 py-3 border-b-2 ${activeSection === 'received_requests' ? 'border-[#6C48E3] text-[#6C48E3]' : 'border-transparent text-gray-600 hover:text-[#6C48E3]'}`}
            >
              <FaUserPlus className="mr-2" />
              <span>Received Requests</span>
            </button>
            <button
              onClick={() => setActiveSection('my_bookings')}
              className={`flex items-center px-4 py-3 border-b-2 ${activeSection === 'my_bookings' ? 'border-[#6C48E3] text-[#6C48E3]' : 'border-transparent text-gray-600 hover:text-[#6C48E3]'}`}
            >
              <FaCalendar className="mr-2" />
              <span>My Bookings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Roommates Section */}
        {activeSection === 'roommates' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">My Roommates</h2>
            {dashboardData?.myRoommates?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {dashboardData?.myRoommates?.map((roommate, index) => (
                    <div
                    key={index}
                    className="bg-[#F2F4F7] rounded-lg p-4 flex items-center space-x-4 hover:shadow-md transition-shadow"
                  >
                    
                  <Link to={`/roommates/${roommate?.myRoommates?._id}`} key={index}>
                    <div className="flex-shrink-0">
                      <img
                        src={roommate?.myRoommates?.user?.avatar || '/default-avatar.png'}
                        alt={roommate?.myRoommates?.user?.fullName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{roommate?.myRoommates?.user?.fullName || 'User'}</h3>
                      <p className="text-sm text-gray-600">{roommate?.myRoommates?.job}</p>
                      <p className="text-xs text-[#6C48E3] truncate">{roommate?.myRoommates?.user?.email}</p>
                    </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#F2F4F7] rounded-lg p-8 text-center">
                <p className="text-gray-500">No roommates found</p>
              </div>
            )}
          </div>
        )}

        {/* Rooms Section */}
        {activeSection === 'rooms' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">My Rooms</h2>
            {dashboardData?.myRooms?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.myRooms[0]?.rooms.map((room, index) => (
                  <div
                    key={index}
                    className="bg-[#F2F4F7] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <RoomCard {...room} compact={true} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#F2F4F7] rounded-lg p-8 text-center">
                <p className="text-gray-500">No rooms found</p>
              </div>
            )}
          </div>
        )}

        {/* Sent Requests Section */}
        {activeSection === 'sent_requests' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Sent Requests</h2>
            {sentRequest?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sentRequest[0]?.receiver?.map((request, index) => (
                  <div
                    key={index}
                    className="bg-[#F2F4F7] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <RequestCard
                      fullName={request?.user?.fullName}
                      _id={request?._id}
                      avatar={request?.user?.avatar}
                      email={request?.user?.email}
                      job={request?.job}
                      userId={request?.user?._id}
                      cardType="sent"
                      onUpdate={handleSentRequestCancel}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#F2F4F7] rounded-lg p-8 text-center">
                <p className="text-gray-500">No sent requests found</p>
              </div>
            )}
          </div>
        )}

        {/* Received Requests Section */}
        {activeSection === 'received_requests' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Received Requests</h2>
            {receivedRequest?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {receivedRequest[0]?.sender?.map((request, index) => (
                  <div
                    key={index}
                    className="bg-[#F2F4F7] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <RequestCard
                      fullName={request?.user?.fullName || 'Deleted User'}
                      _id={request?._id}
                      avatar={request?.user?.avatar}
                      email={request?.user?.email}
                      job={request?.job}
                      userId={request?.user?._id}
                      cardType="received"
                      onUpdate={handleReceivedRequestAccept}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#F2F4F7] rounded-lg p-8 text-center">
                <p className="text-gray-500">No received requests found</p>
              </div>
            )}
          </div>
        )}

        {/* Edit Profile Section */}
        {activeSection === 'edit_profile' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Profile</h2>
            <Profileform myProfile={userData} />
          </div>
        )}

        {
          activeSection === 'my_bookings' && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">My Bookings</h2>
              {myBookings?.length > 0 ? (
                <div>
                  {myBookings?.map((booking, index) => (
                    <div
                      key={index}
                      className="bg-[#F2F4F7] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <MyBookings booking={booking} handleCheckIn={handleMyBookings} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#F2F4F7] rounded-lg p-8 text-center">
                  <p className="text-gray-500">No bookings found</p>
                </div>
              )}
            </div>
              )
        }
      </div>
    </div>
  );
};

export default ProfilePage;