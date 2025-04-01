import React, { useState, useEffect } from 'react';
import { Button, ProfileCard, Input, Select } from '../components';
import roommateService from '../services/roommate.services.js';
import { set, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const Profiles = () => {
  const [myAccount, setMyAccount] = useState([]);
  const [users, setUsers] = useState([]);
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const users = await roommateService.getNonRoommates();
        const myAccount = await roommateService.getMyRoommateAccount();
        if (users) {
          setUsers(users.data);
        }

        if (myAccount) {
          setMyAccount(myAccount.data);
          setFlag(true);
        }

      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    })();
  }, []);



  const getSearchResults = async (data) => {
    try {
      setLoading(true);
      const users = await roommateService.searchRoommates(1, 10, data);
      if (users) {
        setUsers(users.data);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };


  return !loading ? (
    <div className="flex flex-col min-h-screen bg-[#F2F4F7] mt-4">

      {
        flag ? (
          <Link to={`/users/myprofile`}>
            <div className="flex items-center gap-3 p-2 bg-[#F2F4F7] rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <img
                src={myAccount?.user?.avatar}
                alt="Profile"
                className="w-16 h-16 object-cover rounded-full shadow-sm"
              />
              <p className="text-sm font-medium text-gray-700">{myAccount?.user?.fullName}</p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3 p-2 bg-[#F2F4F7] rounded-lg hover:bg-gray-200 transition-colors duration-200">

            <p className="text-sm font-medium text-gray-700">Create Roommate Account</p>
            <div className="ml-auto">
              <Link to="/roommates/add">
                <Button className="bg-[#6C48E3] text-white px-3 py-2 rounded-lg hover:opacity-80 hover:text-[#F2F4F7]">
                  Create
                </Button>
              </Link>
            </div>
          </div>
        )
      }

      <form onSubmit={handleSubmit(getSearchResults)}>
        <div className="w-full max-w-4xl p-4 bg-[#F2F4F7] rounded-lg items-center flex flex-row gap-4">
          <Input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-48 focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
            {...register("query")}
          />

          <Select
            options={["location", "gender", "job", 'age']}
            className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-48 focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
            {...register("field")}
          />

          <Button className="bg-[#6C48E3] text-white px-3 py-2 rounded-lg hover:opacity-80 hover:text-[#F2F4F7]">
            Search
          </Button>

        </div>
      </form>
      <div className="grid cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
          
          {
          (Array.isArray(users) && users.length>0)?(
          users.map((user) => (
            <div key={user._id} className="w-full">
              <ProfileCard
                avatar={user.user.avatar}
                _id={user._id}
                userId={user.user._id}
                haveRoom={user.haveRoom}
                fullName={user.user.fullName}
                location={user.location.address}
                job={user.job}
              />
            </div>
          ))):(
            <p className='text-center'>No User Found</p>
          )}
        

      </div>
    </div>
  ) : (<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C48E3]"></div>);



};

export default Profiles;