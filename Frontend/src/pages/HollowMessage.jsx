import React from 'react';
import messageService from '../services/message.services';
import { useState, useEffect } from 'react';
import { MessageCard } from '../components';

function HollowMessage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const messageProfile = await messageService.getMessageProfile();
        if (messageProfile) {
          setProfiles(messageProfile.data);
        }
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to load profiles');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C48E3]"></div>
        <span className="ml-4 text-lg font-semibold">Loading profiles...</span>
      </div>
    );
  }else if (error && typeof error === 'string') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Error</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }else if (!Array.isArray(profiles) || profiles.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">No profiles found</h2>
          <p className="text-gray-500">It looks like there are no messages available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-screen bg-[#F2F4F7]">
      {/* Sidebar for Messages */}
      <div className="w-full p-4 bg-[#F2F4F7] shadow-lg rounded-r-lg overflow-y-auto md:w-1/4 custom-scroll">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Messages</h2>
        {profiles.map((profile) => (
          profile?.user?._id &&
          (<MessageCard
            key={profile?.user?._id}
            _id={profile?.user?._id}
            avatar={profile?.user?.avatar}
            fullName={profile?.user?.fullName || 'Unknown'}
            unreadCount={profile?.unreadCount}
          />)
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 bg-gray-100 hidden md:block">
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Please Select a User</h2>
            <p className="text-gray-500">Select a user from the sidebar to start chatting.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HollowMessage;