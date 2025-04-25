import React from 'react';
import { Link } from 'react-router-dom';

const BookingCard = ({ booking, handleCheckIn }) => {
  const { room, status, _id: bookingId } = booking;
  const { thumbnail, price, category, _id: roomId, rentPerMonth } = room;
  // Status styling with your colors
  const statusStyles = {
    Booked: 'bg-[#E8F5E9] text-[#2E7D32]', // Green variant
    Reserved: 'bg-[#FFF8E1] text-[#FF8F00]', // Yellow variant
    CheckedIn: 'bg-[#6C48E3] text-[#C62828]' // Red variant
  };

  return (
    <div className="bg-white rounded-xl border border-[#F2F4F7] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Card Header with Status */}
      <div className={`px-4 py-2 ${status === 'Booked' ? 'bg-[#6C48E3]' : 'bg-[#F2F4F7]'}`}>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="md:flex">
        {/* Thumbnail */}
        <div className="md:w-1/3">
          <img
            className="w-full h-48 object-cover"
            src={thumbnail}
            alt={`${category} room`}
          />
        </div>

        {/* Details */}
        <div className="p-4 md:w-2/3">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {category} Room
          </h3>
          
          <div className="flex items-center mb-3">
            <div className="w-4 h-4 rounded-full bg-[#6C48E3] mr-2"></div>
            <span className="text-gray-600">Booking ID: {bookingId.slice(-6)}</span>
          </div>

          <div className="bg-[#F2F4F7] p-3 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Monthly Rent:</span>
              <span className="text-[#6C48E3] font-bold">Rs. {rentPerMonth}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Link 
              to={`/rooms/${roomId}`}
              className="flex-1 bg-white border border-[#6C48E3] text-[#6C48E3] hover:bg-[#6C48E3] hover:text-white px-4 py-2 rounded-lg text-center transition-colors duration-200"
            >
              View Room
            </Link>
            <button className="flex-1 bg-[#6C48E3] hover:bg-[#5a3acf] text-white px-4 py-2 rounded-lg transition-colors duration-200" onClick={() => {handleCheckIn(bookingId)}}>
              {status === 'Booked' ? 'Check In' : 'Complete Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
