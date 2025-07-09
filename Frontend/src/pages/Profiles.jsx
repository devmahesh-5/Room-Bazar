import React, { useState, useEffect, useCallback } from 'react';
import { Button, ProfileCard, Input, Select } from '../components';
import roommateService from '../services/roommate.services.js';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Roommateform, Authloader } from '../components/index.js';
import MessageProfile from '../components/MessageProfile.jsx';

const Profiles = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [myAccount, setMyAccount] = useState([]);
  const [users, setUsers] = useState([]);
  const { register, handleSubmit, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [error, setError] = useState(null);
  const [myRoommates, setMyRoommates] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fetchProfiles = () => {
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
        if(!myAccountResponse.data){
          setError("Please create a Roommate Account to see profiles");
        }else{
        setError(error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
  }
  useEffect( fetchProfiles, []);

  const getSearchResults = useCallback(async (data) => {
    
    setSearchQuery(data);
    try {
      setError(null);
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

  const handleUpdate = () => {
    if(searchQuery){
      getSearchResults(searchQuery)
    }else{
      fetchProfiles()
    }
  }

  const handleClose = ()=>{
    setActiveSection('');
  }
  return (
    <div className="flex-grow bg-[#F2F4F7] flex flex-col lg:flex-row-reverse">
      {/* Hidden on small screens, visible from lg breakpoint */}
      <div className="hidden lg:block lg:ml-4 lg:w-1/4">
        <MessageProfile />
      </div>
      
      <div className="flex flex-col bg-[#F2F4F7] w-full lg:w-3/4 px-4">
        
        
        <div className="flex flex-col space-y-4">
          {flag ? (
            <div className="flex items-center gap-3 p-3 bg-[#F2F4F7] rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <img
                src={myAccount?.user?.avatar}
                alt="Profile"
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full shadow-sm"
              />
              <div className="flex flex-col">
              <h1 className="text-sm font-medium text-gray-700">{myAccount?.user?.fullName}</h1>
              <h3 className="text-sm font-medium text-gray-400">{myAccount?.location?.address}</h3>
              <h3 className="text-sm font-medium text-gray-400">{myAccount?.job}</h3>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={() => setActiveSection(prev => prev === 'edit' ? '' : 'edit')}
                  className={`flex items-center space-x-2 pointer-cursor hover:bg-[#F2F4F7] hover:text-[#6C48E3] ${activeSection === 'edit' ? 'text-[#6C48E3]' : 'text-gray-700'}`}
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

{flag && activeSection === 'edit' && (
          <div className="bg-[#F2F4F7] rounded-lg shadow-md p-4 mb-4">
            <Roommateform roommate={myAccount} closeEdit={handleClose} />
          </div>
        )}



<form 
  onSubmit={handleSubmit(getSearchResults)} 
  className="bg-[#F2F4F7] p-2 rounded-lg w-full shadow-sm"
>
  <div className="flex items-center gap-2 w-full">
    {/* Search Input - Takes priority space */}
    <div className="flex-grow relative">
      <label htmlFor="search-query" className="sr-only">
        Search
      </label>
      <input
        id="search-query"
        type="text"
        placeholder="Search rooms..."
        className="px-4 py-2 rounded-lg bg-gray-50 w-full text-sm focus:bg-white focus:ring-1 focus:ring-[#6C48E3] focus:border-[#6C48E3] border border-gray-200 transition-all"
        {...register("query")}
      />
      
      {/* Search icon inside input (visible on mobile) */}
      <button 
        type="submit"
        className="md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#6C48E3]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>

    {/* Dropdown Select - Collapses on mobile */}
    <div className="hidden sm:block w-32 flex-shrink-0">
      <select
        id="search-field"
        className="px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-[#6C48E3] focus:border-[#6C48E3] w-full"
        {...register("field")}
      >
        <option value="location">Location</option>
        <option value="gender">Gender</option>
        <option value="job">Job</option>
      </select>
    </div>

    {/* Search Button - Hidden on mobile, visible on desktop */}
    <button
      type="submit"
      className="hidden sm:flex items-center justify-center bg-[#6C48E3] text-white p-2 rounded-lg hover:bg-[#5a3acf] transition-colors flex-shrink-0"
      title="Search"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="sr-only">Search</span>
    </button>
  </div>

  {/* Mobile filter toggle - appears only on mobile */}
  <div className="sm:hidden flex justify-between mt-2">
    <button 
      type="button"
      onClick={() => setShowFilters(!showFilters)}
      className="text-xs text-[#6C48E3] flex items-center gap-1"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
      Filters
    </button>
    
    {watch('query') && (
      <button 
        type="submit"
        className="hidden sm:block md:block text-xs text-[#6C48E3]"
      >
        Search
      </button>
    )}
  </div>

  {/* Expanded filters - appears when showFilters is true on mobile */}
  {showFilters && (
    <div className="sm:hidden mt-3 space-y-2">
      <label htmlFor="mobile-search-field" className="block text-xs font-medium text-gray-700">
        Search by:
      </label>
      <select
        id="mobile-search-field"
        className="px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 w-full"
        {...register("field")}
      >
        <option value="location">Location</option>
        <option value="gender">Gender</option>
        <option value="job">Job</option>
      </select>
    </div>
  )}
</form>
        </div>

    {    !loading?(<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 py-4">
          {!error?(Array.isArray(users) && users?.length > 0 ? (
            users.map((user) => (
              <div key={user?._id} className="w-full">
                <Link to={`/roommates/${user?._id}`}>
                <ProfileCard
                  avatar={user?.user?.avatar}
                  _id={user?._id}
                  userId={user?.user?._id}
                  haveRoom={user?.haveRoom}
                  fullName={user?.user?.fullName}
                  location={user?.location?.address}
                  job={user?.job}
                  alreadyRoommate={myRoommates?.some((roommate) => roommate?.myRoommates?.user?._id === user?.user?._id)}
                  onUpdate={handleUpdate}
                />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-4">
              <p className='text-gray-700'>No User Found</p>
            </div>
          )):(
            <div className="col-span-full text-center py-4">
              <p className='text-gray-700'>{error?.response?.data?.error || 'Something went wrong while fetching Roommates'}</p>
            </div>
          )}
        </div>): (
    <Authloader message='Searching Roommates...' fullScreen={false} />
  )}
      </div>
    </div>
  ) 
};

export default Profiles;