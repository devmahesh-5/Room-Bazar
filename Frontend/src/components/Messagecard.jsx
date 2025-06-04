import React from 'react';
import { Link } from 'react-router-dom';
const MessageCard = ({ _id, avatar, fullName,unreadCount }) => {//userid
  // console.log(unreadCount);
  
  return (
    <Link to={`/messages/ib/${_id}`}>
    <div className="flex items-center p-3 hover:bg-gray-200 hover:opacity-80 cursor-pointer rounded-lg bg-[#F2F4F7] my-2" key={_id}>
      <div className="mr-4">
        <img src={avatar} alt={fullName || 'U'} className="w-12 h-12 rounded-full object-cover" />
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{fullName || 'Unknown User'}</h3>
        {unreadCount > 0 && (
          //[#6C48E3] color dot here
          <p className="text-sm text-[#6C48E3]">{unreadCount} unread messages</p>)}
      </div>
    </div>
    </Link>
  );
};

export default MessageCard;
