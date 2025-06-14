import React, { useState, useEffect } from 'react';
import messageService from '../services/message.services';
import { MessageCard } from '../components/index.js';

function MessageProfile() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const messageProfile = await messageService.getMessageProfile();
        if (messageProfile) {
          setProfiles(messageProfile?.data);
        }
      } catch (error) {
        console.error('Error fetching message profiles:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // if (loading) {
  //   return <div className="text-center p-4">Loading profiles...</div>;
  // }

  

  if (!Array.isArray(profiles) || profiles.length === 0) {
    return (
      <div className="w-1/3 p-4 bg-[#F2F4F7] rounded-lg sticky top-0">
        <h2 className="text-lg font-semibold">No profiles found</h2>
      </div>
    );
  }

  return (
    <div className="w-72 p-4 bg-[#F2F4F7] rounded-lg sticky top-0 h-screen overflow-y-auto custom-scroll">
      <h2 className="text-lg font-semibold mb-4">Contacts</h2>
      {profiles.map((profile) => (
        profile?.user?._id &&
        (<div key={profile?.user?._id}>
        <MessageCard
          _id={profile?.user?._id}
          avatar={profile?.user?.avatar}
          fullName={profile?.user?.fullName}
        />
        </div>)
      ))}
    </div>
  );
}

export default MessageProfile;