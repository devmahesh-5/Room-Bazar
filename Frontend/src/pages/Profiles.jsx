import React, { useState, useEffect, useCallback } from 'react';
import { Button, ProfileCard, Input, Select } from '../components';
import roommateService from '../services/roommate.services.js';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {Roommateform} from '../components/index.js';
const Profiles = () => {
  const [myAccount, setMyAccount] = useState([]);
  const [users, setUsers] = useState([]);
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [error, setError] = useState(null);
  const [myRoommates, setMyRoommates] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    const isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const [userResponse, myAccountResponse] = await Promise.all([
          roommateService.getNonRoommates(),
          roommateService.getMyRoommateAccount()
        ])

        if (isMounted) {
          if (userResponse) {
            setUsers(userResponse.data);
          }

          if (myAccountResponse) {
            setMyAccount(myAccountResponse.data);
            setFlag(true);
          }
        }

      } catch (error) {
        setError(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
  }, []);

  const getSearchResults = useCallback(
    async (data) => {
      try {
        setLoading(true);
        const [users, myRoommates] = await Promise.all([
          await roommateService.searchRoommates(1, 10, data),
          await roommateService.getMyRoommates()
        ])
        if (users) {
          setUsers(users.data);
        }

        if (myRoommates) {

          setMyRoommates(myRoommates.data);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }, [setUsers])
  
  return !loading ? (
    <div className="flex flex-col min-h-screen bg-[#F2F4F7] mt-4">

      {
        flag && activeSection ==='edit'&& (
          <div className="bg-[#F2F4F7] rounded-lg shadow-md p-3">
            < Roommateform  roommate={myAccount}/>
          </div>
        )
      }
      {
      flag &&(<div className="flex items-center gap-3 p-2 bg-[#F2F4F7] rounded-lg hover:bg-gray-200 transition-colors duration-200">
        <img
          src={myAccount?.user?.avatar}
          alt="Profile"
          className="w-16 h-16 object-cover rounded-full shadow-sm"
        />
        <p className="text-sm font-medium text-gray-700">{myAccount?.user?.fullName}</p>
        <div className="ml-auto">
        <Button
                  onClick={() => setActiveSection(prev => prev === 'edit' ? '' : 'edit')}
                  className={`flex items-center space-x-2 ${activeSection === 'edit' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
                >
                  
                    {
                      activeSection === 'edit' ? (
                        <span>
                          Close</span>
                        ):(
                          <span>
                    Edit</span>
                        )
                    }
                </Button>
        </div>
        </div>
      )
      }
      {  
         !flag && (
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
          (Array.isArray(users) && users.length > 0) ? (
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
                  alreadyRoommate={myRoommates.some((roommate) => roommate?.myRoommates?.user?._id === user?.user?._id)}
                />
              </div>
            ))) : (
            <p className='text-center'>No User Found</p>
          )}


      </div>
    </div>
  ) : (<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C48E3]"></div>);



};

export default Profiles;