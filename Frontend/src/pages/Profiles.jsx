import React,{useState,useEffect} from 'react';
import {ProfileCard} from '../components';
import roommateService from '../services/roommate.services.js';
const Profiles = () => {
  const [users, setUsers] = useState({});

  useEffect(() => {
    ;(
      async () => {
        try {
          const users = await roommateService.getAllRoommates();
          console.log(users.data);
          
          if (users) {
            setUsers(users.data);
           
          }
        } catch (error) {
          throw error;
        }
      }
    )();
  }, []);
  if(!Array.isArray(users)||users.length === 0){
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="w-1/3 p-4 bg-gray-100 rounded-lg">
              <p className="text-center">No users found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }else{ return(

    <div className="flex justify-center items-start min-h-screen bg-[#F2F4F7] mt-4">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
            users.map((user)=>(
              <div key={user._id} className='w-full'>
                <ProfileCard avatar={user.user.avatar} _id={user._id} haveRoom={user.haveRoom} fullName={user.user.fullName} location={user.location.address} />
              </div>
            ))
        }
        </div>
    </div>
  ) }
  
};

export default Profiles;