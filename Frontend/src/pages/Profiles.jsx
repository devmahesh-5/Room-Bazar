import React, { useState, useEffect, useCallback } from 'react';
import { Button, ProfileCard, Input, Select } from '../components';
import roommateService from '../services/roommate.services.js';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Roommateform, Authloader } from '../components/index.js';
import MessageProfile from '../components/MessageProfile.jsx';

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
        ]);

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

  const getSearchResults = useCallback(async (data) => {
    try {
      setLoading(true);
      const [users, myRoommates] = await Promise.all([
        await roommateService.searchRoommates(1, 10, data),
        await roommateService.getMyRoommates()
      ]);
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
  }, [setUsers]);

  return !loading ? (
    <div className="flex-grow bg-[#F2F4F7] flex flex-col lg:flex-row-reverse">
      {/* Hidden on small screens, visible from lg breakpoint */}
      <div className="hidden lg:block lg:ml-4 lg:w-1/4">
        <MessageProfile />
      </div>
      
      <div className="flex flex-col bg-[#F2F4F7] w-full lg:w-3/4 px-4">
        {flag && activeSection === 'edit' && (
          <div className="bg-[#F2F4F7] rounded-lg shadow-md p-4 mb-4">
            <Roommateform roommate={myAccount} />
          </div>
        )}
        
        <div className="flex flex-col space-y-4">
          {flag ? (
            <div className="flex items-center gap-3 p-3 bg-[#F2F4F7] rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <img
                src={myAccount?.user?.avatar}
                alt="Profile"
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full shadow-sm"
              />
              <p className="text-sm font-medium text-gray-700">{myAccount?.user?.fullName}</p>
              <div className="ml-auto">
                <Button
                  onClick={() => setActiveSection(prev => prev === 'edit' ? '' : 'edit')}
                  className={`flex items-center space-x-2 ${activeSection === 'edit' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
                >
                  {activeSection === 'edit' ? <span>Close</span> : <span>Edit</span>}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-[#F2F4F7] rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <p className="text-sm font-medium text-gray-700">Create Roommate Account</p>
              <div className="ml-auto">
                <Link to="/roommates/add">
                  <Button className="bg-[#6C48E3] text-white px-3 py-2 rounded-lg hover:opacity-80 hover:text-[#F2F4F7]">
                    Create
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(getSearchResults)} className="bg-[#F2F4F7] p-3 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Input
                type="text"
                placeholder="Search..."
                className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
                {...register("query")}
              />

              <Select
                options={["location", "gender", "job", 'age']}
                className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
                {...register("field")}
              />

              <Button className="bg-[#6C48E3] text-white px-3 py-2 rounded-lg hover:opacity-80 hover:text-[#F2F4F7] w-full sm:w-auto">
                Search
              </Button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 py-4">
          {Array.isArray(users) && users.length > 0 ? (
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
            ))
          ) : (
            <div className="col-span-full text-center py-4">
              <p className='text-gray-700'>No User Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <Authloader message='Searching Roommates...' fullScreen={false} />
  );
};

export default Profiles;