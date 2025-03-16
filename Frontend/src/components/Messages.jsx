import React, { useState,useEffect } from 'react';
import messageService from '../services/message.services';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {MessageCard} from '../components/index.js'
import Inboxform from './forms/Inboxform.jsx';
function Messages() {
    const userId = useParams()?.userId;
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const messageProfile = await messageService.getMessageProfile();
        if (messageProfile) {
          setProfiles(messageProfile.data);
        }
      } catch (error) {
        console.error('Error fetching message profiles:', error);
      } finally {
        setLoading(false);
      }

    })();
  }, []);


 if (loading) {
    return <div className="text-center p-4">Loading profiles...</div>;
  }

  if (!Array.isArray(profiles) || profiles.length === 0) {
    return (
      <div className="w-1/3 p-4 bg-[#F2F4F7] rounded-lg sticky top-0">
        <h2 className="text-lg font-semibold">No profiles found</h2>
      </div>
    );
  }

  return (
    <div className='flex flex-row'>
    <div className="w-72 p-4 bg-[#F2F4F7] rounded-lg sticky top-0 h-screen overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Messages</h2>
      {profiles.map((profile) => (
        <MessageCard
          key={profile.user._id}
          _id={profile.user._id}
          avatar={profile.user.avatar}
          fullName={profile.user.fullName}
        />
      ))}
    </div>
    <div className="flex-1 p-4 bg-[#F2F4F7] rounded-lg">
        <Inboxform userId={userId} />
    </div>
    </div>
  );
    
}

export default Messages;
