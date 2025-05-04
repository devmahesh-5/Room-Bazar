import React, { useState, useEffect } from 'react';
import authService from '../services/auth.services.js';
import { FaUsers, FaHome, FaDog, FaCat } from 'react-icons/fa';
import { GiSmokingPipe } from 'react-icons/gi';
import { MdSmokeFree } from 'react-icons/md';
import RoomCard from './Roomcard.jsx';
import roommateService from '../services/roommate.services.js';
import { Authloader } from '../components/index.js';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const roommateId = useParams().roommateId;
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        myRoommates: [],
        myRooms: []
    });
    const [activeSection, setActiveSection] = useState('roommates');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            try {
                const [myAccountResponse, myRoommatesResponse] = await Promise.all([
                    roommateService.getRoommateById(roommateId),
                    authService.getUserDashboard(roommateId)
                ]);

                if (isMounted) {
                    setUserData(myAccountResponse.data[0]);
                    setDashboardData(myRoommatesResponse.data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [roommateId]);
    if (loading) {
        return <Authloader message="Loading Profile" />;
    }

    if (!userData) {
        return <div className="p-6 text-center">User not found</div>;
    }

    return (
        <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
            {/* Profile Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                {/* Cover Image */}
                <div className="h-48 bg-gray-200 relative">
                    {userData?.user?.coverImage ? (
                        <img
                            src={userData?.user?.coverImage}
                            alt="Cover"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.className = "w-full h-full bg-gradient-to-r from-purple-400 to-indigo-600";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                    )}
                </div>

                {/* Profile Info */}
                <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                        <div className="relative -mt-16 md:-mt-32">
                            <img
                                src={userData?.user?.avatar}
                                alt={userData?.user?.fullName}
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover shadow-md"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/default-avatar.png';
                                }}
                            />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                            <h3 className="text-2xl font-bold text-gray-800">{userData?.user?.fullName}</h3>
                            {userData?.description && (
                                <p className="text-gray-600 italic">"{userData.description}"</p>
                            )}
                            
                            <div className="flex flex-wrap gap-2">
                                {userData?.job && (
                                    <span className="px-3 py-1 rounded-full text-sm">
                                        {userData.job}
                                    </span>
                                )}
                                {userData?.location?.address && (
                                    <span className=" px-3 py-1 rounded-full text-sm flex items-center">
                                        <FaHome className="mr-1" /> {userData.location.address}
                                    </span>
                                )}
                                {userData?.smoking ? (
                                    <span className="px-3 py-1 rounded-full text-sm flex items-center">
                                        <GiSmokingPipe className="mr-1" /> Smoker
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full text-sm flex items-center">
                                        <MdSmokeFree className="mr-1" /> Non-smoker
                                    </span>
                                )}
                                {userData?.pets && (
                                    <span className="px-3 py-1 rounded-full text-sm flex items-center">
                                        {userData.pets.includes('dog') ? <FaDog className="mr-1" /> : <FaCat className="mr-1" />}
                                        {userData.pets}
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap gap-4 pt-2">
                                {userData?.user?.email && (
                                    <a href={`mailto:${userData.user.email}`} className="text-[#6C48E3] hover:underline flex items-center">
                                        {userData.user.email}
                                    </a>
                                )}
                                {userData?.user?.phone && (
                                    <a href={`tel:${userData.user.phone}`} className="text-[#6C48E3] hover:underline flex items-center">
                                        {userData.user.phone}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto mb-6 bg-white rounded-lg shadow-sm">
                
                <button
                    onClick={() => setActiveSection('roommates')}
                    className={`flex-1 py-3 px-4 text-center font-medium ${activeSection === 'roommates' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <div className="flex items-center justify-center space-x-2">
                        <FaUsers />
                        <span>Roommates</span>
                    </div>
                </button>
                {userData?.roomPhotos?.length > 0 && (
                    <button
                        onClick={() => setActiveSection('roomPhotos')}
                        className={`flex-1 py-3 px-4 text-center font-medium ${activeSection === 'roomPhotos' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <FaHome />
                            <span>Room Photos</span>
                        </div>
                    </button>
                )}
                <button
                    onClick={() => setActiveSection('rooms')}
                    className={`flex-1 py-3 px-4 text-center font-medium ${activeSection === 'rooms' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <div className="flex items-center justify-center space-x-2">
                        <FaHome />
                        <span>Rooms</span>
                    </div>
                </button>
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
                {/* Roommates Section */}
                {activeSection === 'roommates' && (
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Current Roommates</h3>
                        {dashboardData.myRoommates?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {dashboardData.myRoommates?.map((roommate, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-100 transition-colors border border-gray-200"
                                    >
                                        <div className="flex-shrink-0">
                                            <img
                                                src={roommate?.myRoommates?.user?.avatar || '/default-avatar.png'}
                                                alt={roommate?.myRoommates?.user?.fullName}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/default-avatar.png';
                                                }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 truncate">
                                                {roommate?.myRoommates?.user?.fullName}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {roommate?.myRoommates?.job}
                                            </p>
                                            <p className="text-xs text-indigo-600 truncate">
                                                {roommate?.myRoommates?.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                                <p className="text-gray-500">No roommates found</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Rooms Section */}
                {activeSection === 'rooms' && (
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Available Rooms</h3>
                        {dashboardData.myRooms?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {dashboardData.myRooms[0]?.rooms.map((room, index) => (
                                    <div key={index} className="hover:shadow-lg transition-shadow">
                                        <RoomCard {...room} compact={true} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                                <p className="text-gray-500">No rooms found</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Room Photos Section */}
                {activeSection === 'roomPhotos' && userData?.roomPhotos && (
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Room Photos</h3>
                        {userData?.roomPhotos?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {userData?.roomPhotos?.map((photo, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                                    >
                                        <img
                                            src={photo}
                                            alt={`Room Photo ${index + 1}`}
                                            className="w-full h-48 object-cover hover:scale-105 transition-transform"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder-room.jpg';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                                <p className="text-gray-500">No room photos available</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;