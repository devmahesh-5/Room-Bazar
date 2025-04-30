import React from 'react';
import { Link } from 'react-router-dom';

const NotificationCard = ({ _id, message, isRead, timestamp }) => {


  // Format timestamp (e.g., "2 hours ago")
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    // <Link to={`/notifications/${_id}`}>
      <div
        className={`flex items-center p-3 border hover:border-[#6C48E3] rounded-lg bg-[#F2F4F7] my-2 transition-all duration-200 ${
          !isRead ? 'shadow-sm' : 'border-gray-200'
        }`}
        key={_id}
      >
       
        {/* Notification Content */}
        <div className="flex flex-col flex-1">
          <h3
            className={`text-lg ${
              !isRead ? 'text-[#6C48E3] font-semibold' : 'text-gray-700'
            }`}
          >
            {message}
          </h3>
          {timestamp && (
            <p className="text-sm text-gray-500">{formatTimestamp(timestamp)}</p>
          )}
        </div>

        {/* Unread Indicator */}
        {!isRead && (
          <div className="w-2 h-2 bg-[#6C48E3] rounded-full ml-3"></div>
        )}
      </div>
    // </Link>
  );
};

export default NotificationCard;