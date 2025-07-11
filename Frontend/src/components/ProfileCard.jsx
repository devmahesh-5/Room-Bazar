import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import roommateService from '../services/roommate.services.js';
import { set } from 'react-hook-form';

const ProfileCard = ({ avatar, _id, userId, fullName, location, haveRoom, job, alreadyRoommate = false, onUpdate }) => {
  const [error, setError] = React.useState(null)
  const navigate = useNavigate();
  const [loadingSend, setLoadingSend] = React.useState(false);
  const [loadingUnfriend, setLoadingUnfriend] = React.useState(false);
  const sendRequest = async () => {
    try {
      setLoadingSend(true);
      const response = await roommateService.sendRoommateRequest(_id);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error sending roommate request:', error);
    } finally {
      setLoadingSend(false);
    }
  }
  const unfriend = async () => {
    try {
      setLoadingUnfriend(true);
      const response = await roommateService.deleteRoommate(_id);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoadingUnfriend(false);
    }
  }

  const handleMessageClick = () => {
    navigate(`/messages/ib/${userId}`);
  };

  return (
    <div>
      {/* //roommate id */}
      <div className="w-full max-w-sm bg-[#F2F4F7] shadow hover:opacity-80 transition duration-300 rounded-lg overflow-hidden p-4 cursor-pointer m-auto">
        {/* Top Section: Avatar and User Info */}
        <div className="flex items-center cursor-pointer">
          {avatar ? (
            <img
              src={avatar}
              alt="Profile"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
          ) :  (
                  <svg
                    className="w-16 h-16 rounded-full object-cover text-[#6C48E3] border-2 border-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>)}
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
          {alreadyRoommate ? (<button className="flex-1 mr-2 px-3 py-1 bg-[#6C48E3] text-white text-sm font-semibold rounded hover:opacity-80 transition duration-300" onClick={(e) => {
  e.stopPropagation();
  e.preventDefault();
  unfriend();
}}>
            Unfriend
          </button>) : !loadingSend ? (
            <button className="flex-1 mr-2 px-3 py-1 bg-[#6C48E3] text-white text-sm font-semibold rounded hover:opacity-80 transition duration-300 md:px-2 md:py-1 md:text-xs" onClick={(e)=>{
              e.stopPropagation();
              e.preventDefault();
              sendRequest();
            }}>
              Request 
            </button>) : (
            <button 
            className="flex-1 mr-2 px-3 py-1 bg-[#6C48E3] text-white text-sm font-semibold rounded hover:opacity-80 transition duration-300" 
            onClick={(e)=>{
              e.stopPropagation();
              e.preventDefault();
            }}
            disabled
            >
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          )
          }
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleMessageClick();
            }}
            className="flex-1 ml-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-semibold rounded hover:bg-gray-300 transition duration-300"
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
