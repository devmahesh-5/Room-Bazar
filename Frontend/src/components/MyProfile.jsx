import React, { useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.services.js';
import { FaUsers, FaEdit, FaHome, FaUserPlus } from 'react-icons/fa';
import RoomCard from './Roomcard.jsx';
import roommateService from '../services/roommate.services.js';
import { RequestCard, Roommateform, Profileform, Authloader } from '../components/index.js';
import { Link } from 'react-router-dom';

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
  const [activeSection, setActiveSection] = useState('roommates');
  const [loading, setLoading] = useState(!userData?._id);
  const [myRoommateAccount, setMyRoommateAccount] = useState(null);

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

  useEffect(() => {
    if (activeSection === 'sent_requests') {
      fetchSentRequests();
    } else if (activeSection === 'received_requests') {
      fetchReceivedRequests();
    }
  }, [activeSection, fetchSentRequests, fetchReceivedRequests]);

  if (loading) {
    return <Authloader message="Loading Profile" />;
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7]">
      {/* Profile Header */}
      <div className="bg-white rounded-b-lg shadow-md">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 relative">
          {userData?.coverImage && (
            <img
              src={userData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.className = "w-full h-full bg-gradient-to-r from-gray-200 to-gray-300";
              }}
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <div className="relative">
              <img
                src={userData?.avatar}
                alt={userData?.fullName}
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.className = "w-24 h-24 rounded-full border-4 border-white shadow-md bg-gradient-to-r from-gray-200 to-gray-300";
                }}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 pt-8">{userData?.fullName}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <p className="text-gray-600 text-sm flex items-center">
                  <span className="font-medium">Email:</span> {userData?.email}
                </p>
                {userData?.phone && (
                  <p className="text-gray-600 text-sm flex items-center">
                    <span className="font-medium">Phone:</span> {userData.phone}
                  </p>
                )}
                {userData?.address && (
                  <p className="text-gray-600 text-sm flex items-center">
                    <span className="font-medium">Current Address:</span> {userData.address}
                  </p>
                )}
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Roommates Section */}
        {activeSection === 'roommates' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">My Roommates</h2>
            {dashboardData.myRoommates?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {dashboardData.myRoommates?.map((roommate, index) => (
                    <div
                    key={index}
                    className="bg-[#F2F4F7] rounded-lg p-4 flex items-center space-x-4 hover:shadow-md transition-shadow"
                  >
                    
                  <Link to={`/roommates/${roommate.myRoommates?._id}`} key={index}>
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
                      <h3 className="font-medium text-gray-800">{roommate?.myRoommates?.user?.fullName}</h3>
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
            {dashboardData.myRooms?.length > 0 ? (
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
                {sentRequest[0].receiver.map((request, index) => (
                  <div
                    key={index}
                    className="bg-[#F2F4F7] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <RequestCard
                      fullName={request.user.fullName}
                      _id={request._id}
                      avatar={request.user.avatar}
                      email={request.user.email}
                      job={request.job}
                      userId={request.user._id}
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
                {receivedRequest[0].sender.map((request, index) => (
                  <div
                    key={index}
                    className="bg-[#F2F4F7] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <RequestCard
                      fullName={request.user.fullName}
                      _id={request._id}
                      avatar={request.user.avatar}
                      email={request.user.email}
                      job={request.job}
                      userId={request.user._id}
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

        {/* Edit Roommate Section */}
        {activeSection === 'edit' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Roommate Profile</h2>
            <Roommateform roommate={myRoommateAccount} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;