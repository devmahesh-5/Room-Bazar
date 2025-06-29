import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ _id, thumbnail, price, title, location, rentPerMonth, status, owner, className = '', compact = false,createdAt,updatedAt }) => {
  const statusColors = {
    Available: 'bg-[#6C48E3] text-[#6C48E3] border border-[#6C48E3]',
    Reserved: 'bg-[#F2F4F7] text-red-800 border border-red-800',
  };

  const [time,setTime]=React.useState('just now');
  const formatDate = (createdAt)=>{
    const date = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0) {
      return `${years} years ago`;
    } else if (months > 0) {
      return `${months} months ago`;
    } else if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return 'just now';
    }
  }

  React.useEffect(()=>{
    if(createdAt){
      setTime(formatDate(createdAt));
    }
  })
  return (
    <Link 
      to={`/rooms/${_id}`} 
      className={`block group ${status === 'Reserved' ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
    >
      <div className={`relative w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
        {/* Status Badge */}
        <div className={`z-10 absolute top-3 left-3 px-1 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        </div>

        {/* Thumbnail with subtle overlay */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={thumbnail}
            alt={`Thumbnail for ${title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
            <p className="text-sm text-white font-medium">Posted by: {owner?.fullName || 'Owner'}</p>
          </div>
        </div>

        {/* Room Details */}
        <div className="p-4 space-y-2.5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate" title={title}>
              {title}
            </h3>
            <p className="text-sm text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </p>
            <p className="text-xs text-[#6C48E3]">Posted:{time}</p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Total Price</p>
              <p className="font-medium text-gray-900">Rs. {price}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Monthly Rent</p>
              <p className="font-medium text-[#6C48E3]">Rs. {rentPerMonth}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;