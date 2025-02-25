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
        const users = await roommateService.getAllRoommates();
        const myAccount = await roommateService.getMyRoommateAccount();
        
        if (users && myAccount) {

          setMyAccount(myAccount.data);
          setUsers(users.data);
          setFlag(true);
        }
      } catch (error) {

        throw error;
      }finally{
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

  if (!Array.isArray(users) || users.length === 0) {
    return !loading?(
        <div className="flex flex-col min-h-screen bg-[#F2F4F7] mt-4">
      {/* Search and Filter Section */}
      {   
  flag && (
    <Link to={`/roommates/${myAccount?._id}`}>
    <div className="flex items-center gap-3 p-2 bg-[#F2F4F7] rounded-lg border-2 border-[#6C48E3] hover:bg-gray-200 transition-colors duration-200">
    <img
      src={myAccount?.user?.avatar}
      alt="Profile"
      className="w-16 h-16 object-cover rounded-full border border-[#6C48E3] shadow-sm"
    />
    <p className="text-sm font-medium text-gray-700">{myAccount?.user?.fullName}</p>
    <div className="ml-auto">
      <Link to="/roommates/update">
        <Button className="bg-[#6C48E3] text-white px-3 py-2 rounded-lg hover:opacity-80 hover:text-[#F2F4F7]">
          Update
        </Button>
      </Link>
    </div>
  </div>
  </Link>
  )
}

  {
    !flag && (
      <div className="flex items-center gap-3 p-2 bg-[#F2F4F7] rounded-lg border border-[#6C48E3] hover:bg-gray-200 transition-colors duration-200">
      
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
                                options={["location","gender", "job",'age']}
                                className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-48 focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
                                {...register("field")}
                              />
                              
                              <Button className="bg-[#6C48E3] text-white px-3 py-2 rounded-lg hover:opacity-80 hover:text-[#F2F4F7]">
                                Search
                              </Button>
                              
                            </div>
                              </form>
          <div className="col-md-12">
            <div className="w-1/3 p-4 bg-gray-100 rounded-lg">
              <p className="text-center">No users found</p>
            </div>
          </div>
        </div>
    ):(<div>Loading...</div>);
  }

  return !loading ? (
    <div className="flex flex-col min-h-screen bg-[#F2F4F7] mt-4">
   {
  myAccount && (
    <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
      <img
        src={myAccount?.user?.avatar}
        alt="Profile"
        className="w-10 h-10 object-cover rounded-full border-2 border-white shadow-sm"
      />
      <p className="text-sm font-medium text-gray-700">{myAccount?.user?.fullName}</p>
    </div>
  )
}
      {/* Search and Filter Section */}
      <form onSubmit={handleSubmit(getSearchResults)}>
                      <div className="w-full max-w-4xl p-4 bg-[#F2F4F7] rounded-lg items-center flex flex-row gap-4">
                              <Input
                                type="text"
                                placeholder="Search..."
                                className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-48 focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
                                {...register("query")}
                              />
                      
                              <Select
                                options={["location","gender", "job",'age']}
                                className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-48 focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
                                {...register("field")}
                              />
                              
                              <Button className="bg-[#6C48E3] text-white px-3 py-2 rounded-lg hover:opacity-80 hover:text-white">
                                Search
                              </Button>
                              
                            </div>
                              </form>
      {/* Profiles Grid */}
      <div className="w-full max-w-4xl mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user._id} className="w-full">
            <ProfileCard
              avatar={user.user.avatar}
              _id={user._id}
              haveRoom={user.haveRoom}
              fullName={user.user.fullName}
              location={user.location.address}
              job={user.job}
            />
          </div>
        ))}
      </div>
    </div>
  ):(
    <div>Loading...</div>
  );
};

export default Profiles;