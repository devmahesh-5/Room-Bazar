import React from 'react';
import { Link } from 'react-router-dom';
import roommateService from '../services/roommate.services.js';

const ProfileCard = ({ avatar, _id, userId, fullName, location, haveRoom, job, alreadyRoommate = false }) => {
  const [error, setError] = React.useState(null)
  const sendRequest = async () => {
    try {
      const response = await roommateService.sendRoommateRequest(_id);
    } catch (error) {
      console.error('Error sending roommate request:', error);
    }
  }
  const unfriend = async () => {
   try {
     const response = await roommateService.deleteRoommate(_id);
     
   } catch (error) {
    setError(error);
   }
  }
  return (
    <div>
      {/* //roommate id */}
      <div className="w-full max-w-sm bg-[#F2F4F7] shadow border hover:border-[#6C48E3] rounded-lg overflow-hidden p-4">
        {/* Top Section: Avatar and User Info */}
        <div className="flex items-center cursor-pointer">
          {avatar ? (
            <img
              src={avatar}
              alt="Profile"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
              {fullName ? fullName.charAt(0) : 'U'}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{fullName}</h2>
            <h2 className="text-sm text-[#6C48E3]">{job}</h2>
            {location && <p className="text-sm text-[#6C48E3]">{location}</p>}
            {haveRoom !== false && (
              <p className="text-xs text-gray-400">Have Rooms</p>
            )}
          </div>
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="flex justify-between mt-4">
          {alreadyRoommate ? (<button className="flex-1 mr-2 px-3 py-1 bg-[#6C48E3] text-white text-sm font-semibold rounded hover:opacity-80 transition duration-300" onClick={unfriend}>
            Unfriend
          </button>) : (<button className="flex-1 mr-2 px-3 py-1 bg-[#6C48E3] text-white text-sm font-semibold rounded hover:opacity-80 transition duration-300" onClick={sendRequest}>
            Add Friend
          </button>)}
          <Link to={`/messages/ib/${userId}`}>
            {/* this must be userid */}
            <button className="flex-1 ml-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-semibold rounded hover:bg-gray-300 transition duration-300">
              Message
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
