import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import roomServices from "../services/room.services";
import { Button } from "../components";
import { useSelector } from "react-redux";
import { FaHeart, FaBook } from "react-icons/fa"; // Import icons from react-icons

function Room() {
    const navigate = useNavigate();
    const slug = useParams();
    const [room, setRoom] = useState(null);
    const [isFavourite, setIsFavourite] = useState(false); // State for favourite status
    const userData = useSelector((state) => state.auth.userData);
    const isOwner = room && userData ? room.owner._id === userData._id : false;

    useEffect(() => {
        if (slug.id) {
            (async () => {
                try {
                    const response = await roomServices.getRoomById(slug.id);
                    setRoom(response.data[0]); // Store the room in state
                } catch (error) {
                    console.error("Error fetching room:", error);
                }
            })();
        }
    }, [slug.id]);

    const deleteRoom = async () => {
        try {
            const response = await roomServices.deleteRoom(slug.id);
            if (response) {
                navigate("/rooms");
            }
        } catch (error) {
            console.log("Room deletion Error", error);
            throw new Error("Something went wrong while deleting the room.");
        }
    };

    const handleBook = () => {
        // Add booking logic here
        console.log("Room booked:", room.title);
        alert(`You have booked: ${room.title}`);
    };

    const handleFavourite = () => {
        // Toggle favourite status
        setIsFavourite(!isFavourite);
        console.log("Room favourited:", room.title);
        alert(`Room ${isFavourite ? "removed from favourites" : "added to favourites"}`);
    };

    if (!room) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // Fallback for missing thumbnail or roomPhotos
    const thumbnail = room.thumbnail || (room.roomPhotos && room.roomPhotos[0]) || "https://via.placeholder.com/400x300";

    return (
        <div className="py-10 px-6 max-w-6xl mx-auto">
            {/* Room Image */}
            <div className="w-full mb-8 relative rounded-2xl overflow-hidden shadow-lg">
                <img
                    src={thumbnail}
                    alt={room.title}
                    className="w-full h-96 object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                />
                {isOwner && (
                    <div className="absolute right-6 top-6 flex space-x-4">
                        <Link to={`/rooms/update/${room._id}`}>
                            <Button bgColor="bg-green-600 hover:bg-green-700 text-white" className="px-5 py-2 rounded-md">
                                Edit
                            </Button>
                        </Link>
                        <Button 
                            bgColor="bg-red-600 hover:bg-red-700 text-white" 
                            onClick={deleteRoom} 
                            className="px-5 py-2 rounded-md"
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            {/* Room Details */}
            <div className="space-y-6">
                {/* Title, Price, and Category */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <h1 className="text-3xl font-bold text-gray-800">{room.title}</h1>
                    <div className="flex space-x-4">
                        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                            Rent: Rs.{room.rentPerMonth}
                        </span>
                        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                            Category: {room.category}
                        </span>
                    </div>
                </div>

                {/* Location */}
                <div className="text-[#6C48E3]">
                    <p className="text-lg"><span className="font-semibold">Location:</span> {room.location.address}</p>
                </div>

                {/* Capacity and Total Rooms */}
                <div className="flex space-x-4">
                    <span className="bg-purple-100 text-[#6C48E3] px-4 py-2 rounded-full text-sm font-semibold">
                        Capacity: {room.capacity}
                    </span>
                    <span className="bg-[#789DBC] text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Total Rooms: {room.totalRooms}
                    </span>
                </div>

                {/* Description */}
                <div className="prose max-w-none text-gray-700">
                    <p className="text-lg leading-relaxed">{room.description}</p>
                </div>

                {/* Room Photos */}
                <div className="grid grid-cols-2 gap-4">
                    {room.roomPhotos.map((photo, index) => (
                        <img
                            key={index}
                            src={photo}
                            alt={`Room Photo ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    ))}
                </div>


                {/* Video (if available) */}


                {room.video && (
                    <div className="w-full">
                        <video controls className="w-full rounded-lg">
                            <source src={room.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                {/* Book and Favourite Buttons (for non-owners) */}
                {!isOwner && (
                    <div className="flex space-x-4">
                        <Button
                            bgColor="bg-[#6C48E3] border border-[#6C48E3] hover:bg-blue-700 text-white"
                            onClick={handleBook}
                            className="px-6 py-2 rounded-md flex items-center space-x-2"
                        >
                            <FaBook className="text-lg" />
                            <span>Book</span>
                        </Button>
                        <Button
                            bgColor={`${isFavourite ? "bg-red-600 hover:bg-red-700" : "bg-blue-700 border border-[#6C48E3] hover:bg-[#6C48E3]"} text-white`}
                            onClick={handleFavourite}
                            className="px-6 py-2 rounded-md flex items-center space-x-2"
                        >
                            <FaHeart className="text-lg" />
                            <span>{isFavourite ? "Favourited" : "Favourite"}</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Room;