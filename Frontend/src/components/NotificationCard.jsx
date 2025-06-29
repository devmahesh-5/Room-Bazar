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
  className={`flex items-start gap-3 p-4 border-l-4 rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer ${
    !isRead 
      ? 'border-l-[#6C48E3] bg-[#6C48E3]/5' 
      : 'border-l-transparent bg-[#F2F4F7]'
  }`}
  key={_id}
>
  {/* Status Indicator */}
  <div className="mt-1">
    {!isRead ? (
      <div className="w-2.5 h-2.5 bg-[#6C48E3] rounded-full flex-shrink-0"></div>
    ) : (
      <div className="w-2.5 h-2.5 border border-gray-300 rounded-full flex-shrink-0"></div>
    )}
  </div>

  {/* Notification Content */}
  <div className="flex-1 min-w-0">
    <h3
      className={`text-base ${
        !isRead ? 'font-semibold text-gray-900' : 'text-gray-700'
      }`}
    >
      {message}
    </h3>
    {timestamp && (
      <div className="mt-1.5 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-gray-400 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-xs text-gray-500">{formatTimestamp(timestamp)}</p>
      </div>
    )}
  </div>

  {/* Action Button (optional) */}
  {!isRead && (
    <button
      className="ml-2 p-1 text-gray-400 hover:text-[#6C48E3] rounded-full hover:bg-[#6C48E3]/10"
      onClick={(e) => {
        e.stopPropagation();
        // Add your mark as read handler here
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </button>
  )}
</div>
    // </Link>
  );
};

export default NotificationCard;