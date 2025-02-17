import React from 'react';

const MessageCard = ({ _id, avatar, fullName }) => {
  return (
    <div className="flex items-center p-3 border hover:border-[#6C48E3] rounded-lg bg-[#F2F4F7] my-2" key={_id}>
      <div className="mr-4">
        <img src={avatar} alt="User Avatar" className="w-12 h-12 rounded-full object-cover" />
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{fullName}</h3>
      </div>
    </div>
  );
};

export default MessageCard;
