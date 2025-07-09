import React from 'react';
import { Link } from 'react-router-dom';
const MessageCard = ({ _id, avatar, fullName,unreadCount }) => {//userid
  
  return _id && (
    <Link to={`/messages/ib/${_id}`}>
    <div className="flex items-center p-3 hover:bg-gray-200 hover:opacity-80 cursor-pointer rounded-lg bg-[#F2F4F7] my-2" key={_id}>
      <div className="mr-4">
       { avatar?(<img src={avatar} alt={fullName || 'U'} className="w-12 h-12 rounded-full object-cover" />): (
                  <svg
                    className="w-12 h-12 rounded-full object-cover text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>)}
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{fullName || 'Unknown User'}</h3>
        {unreadCount > 0 && (
          //[#6C48E3] color dot here
          <p className="text-sm text-[#6C48E3] font-semibold">{unreadCount} unread messages</p>)}
      </div>
    </div>
    </Link>
  );
};

export default MessageCard;
