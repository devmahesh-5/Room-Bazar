import React from 'react'
import roommateService from '../services/roommate.services.js';
import Authloader from './Authloader.jsx';
function RequestCard({
  userId,
  _id,
  avatar,
  fullName,
  job,
  location,
  haveRoom,
  cardType = '',
  onUpdate
}) {
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const acceptRequest = async () => {
    try {
      setLoading(true);
      const acceptRequest = await roommateService.acceptRoommateRequest(_id);
      if (acceptRequest) {
        onUpdate();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = () => {
    try {
      setLoading(true);
      const rejectRequest = roommateService.rejectRoommateRequest(_id);
      onUpdate();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async () => {
    try {
      setLoading(true);
      const response = await roommateService.cancelRoommateRequest(_id);
      onUpdate();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return !loading ? (
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
        <div className="flex justify-center mt-4">
          {
            cardType === 'received' && (
              <div>
                <button className="flex-1 mr-2 px-3 py-1 bg-[#6C48E3] text-white text-sm font-semibold rounded hover:opacity-80 transition duration-300" onClick={acceptRequest}>
                  Accept
                </button>
                {/* this must be userid */}
                <button className="flex-1 ml-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-semibold rounded hover:bg-gray-300 transition duration-300" onClick={rejectRequest}>
                  Reject
                </button>

              </div>)}
          {
            cardType === 'sent' && (
              <div className="flex space-x-4">
                <button className="flex-1 mr-2 px-3 py-1 bg-[#6C48E3] text-white text-sm font-semibold rounded hover:opacity-80 transition duration-300" onClick={cancelRequest}>
                  Cancel
                </button>

                <button className="flex-1 mr-2 px-3 py-1 bg-gray-200 text-[#6C48E3] text-sm font-semibold rounded hover:opacity-80 transition duration-300" onClick={() => window.location.href = `/messages/ib/${userId}`}>
                  Message
                </button>
              </div>
            )}

        </div>
      </div>
    </div>
  ):(
    <Authloader message='loading please wait...'/>
  )
}

export default RequestCard
