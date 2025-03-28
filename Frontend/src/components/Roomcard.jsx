import React from 'react';
import { Link } from 'react-router-dom';
const RoomCard = ({ _id,thumbnail, price, title, location, rentPerMonth,className='',compact=false }) => {

  return (
    <Link to={`/rooms/${_id}`} className="block group">
      <div className={`w-full max-w-sm bg-[#F2F4F7] shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4 cursor-pointer border hover:border-[#6C48E3] ${className}`}>
        {/* Thumbnail */}
        <img
          src={thumbnail}
          alt={`Thumbnail for ${title}`}
          className="w-full h-48 object-cover rounded-lg mb-4"
          loading="lazy"
        />

        {/* Room Details */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 truncate" title={title}>
            {title}
          </h3>
          <p className="text-gray-500 truncate" title={location}>
            {location}
          </p>
          <div className="flex items-center justify-between text-gray-700">
            <span className={compact ? 'text-sm' : 'text-lg'}>Broker Price: Rs.{price}</span>
            <span className="text-sm text-green-500">Rent/Month: Rs.{rentPerMonth}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;
