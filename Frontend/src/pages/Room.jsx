import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import roomServices from "../services/room.services.js";
import favouriteService from "../services/favourite.services.js";
import { Button } from "../components";
import { useSelector } from "react-redux";
import { FaHeart, FaBook, FaStar, FaComment } from "react-icons/fa"; // Import icons from react-icons
import reviewService from "../services/review.services.js";
import { useForm } from "react-hook-form";

function Room() {
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const slug = useParams();
    const [reviews, setReviews] = useState([]);
    const [room, setRoom] = useState(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [showCommentBox, setShowCommentBox] = useState(false); // State to toggle comment box
    const [rating, setRating] = useState(0); // State for user's rating
    const [averageRating, setAverageRating] = useState(0); // State for average room rating
    const userData = useSelector((state) => state.auth.userData);
    const isOwner = room && userData ? room.owner._id === userData._id : false;
    const [htmlContent, setHtmlContent] = useState(null);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (slug.id) {
            (async () => {
                try {
                    const response = await roomServices.getRoomById(slug.id);
                    setRoom(response.data[0]); // Store the room in state

                    // Fetch favourite status
                    try {
                        const favResponse = await favouriteService.getFavouriteByRoomId(slug.id);
                        if (favResponse) {
                            setIsFavourite(true);
                        }
                    } catch (error) {
                        setIsFavourite(false);
                    }

                    // Fetch reviews and calculate average rating
                    try {
                        const reviewResponse = await reviewService.getRoomReviews(slug.id);
                        if (reviewResponse) {
                            setReviews(reviewResponse.data);
                            calculateAverageRating(reviewResponse.data); // Calculate average rating
                        }
                    } catch (error) {
                        console.error("Error fetching room reviews:", error);
                    }
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

    // Calculate average rating
    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) {
            setAverageRating(0);
            return;
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / reviews.length;
        setAverageRating(avgRating.toFixed(1)); // Round to 1 decimal place
    };

    // Handle comment submission
    const handleCommentPost = async (data) => {
        try {
            const commentData = await reviewService.addReview(room._id, { ...data, rating });
            if (!commentData) {
                throw new Error("Error adding review");
            }
            // Refresh reviews after posting
            const reviewResponse = await reviewService.getRoomReviews(slug.id);
            setReviews(reviewResponse.data);
            calculateAverageRating(reviewResponse.data);
            reset(); // Reset the form
            setShowCommentBox(false); // Hide the comment box after submission
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    const handleBook = async () => {
        setBookingLoading(true);
        try {
            const bookingResponse = await roomServices.bookRoom(room._id);
            if (bookingResponse) {
                console.log(bookingResponse.data.price);
                navigate(`/rooms/payment/${room._id}/${bookingResponse.data.price}`);
            }
        } catch (error) {
            console.log(error);
            setError(error.response.data.error);
        }finally{
            setBookingLoading(false);
        }
            
    };

    const handleFavourite = () => {
        try {
            favouriteService.toggleFavourite(room._id).then((response) => {
                if (response) {
                    setIsFavourite(response.data.isFavourite);
                }
            });
        } catch (error) {
            console.error("Error toggling favourite:", error);
        }
    };

    // Toggle comment box visibility
    const toggleCommentBox = () => {
        setShowCommentBox(!showCommentBox);
    };

    if (!room) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // Fallback for missing thumbnail or roomPhotos
    const thumbnail = room.thumbnail || (room.roomPhotos && room.roomPhotos[0]);

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

                {/* Book, Favourite, and Comment Buttons (for non-owners) */}
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
                            <span>{isFavourite ? "Unfavourite" : "Favourite"}</span>
                        </Button>
                        <Button
                            bgColor="bg-[#6C48E3] hover:bg-blue-700 text-white"
                            onClick={toggleCommentBox}
                            className="px-6 py-2 rounded-md flex items-center space-x-2"
                        >
                            <FaComment className="text-lg" />
                            <span>Comment</span>
                        </Button>
                    </div>
                )}

                {/* Rating Section */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Rating</h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold">Average Rating: {averageRating}</span>
                        <div className="flex space-x-1">
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    className={`text-xl ${index < averageRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}

                        </div>
                    </div>
                </div>

                {/* Comment Section */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments</h2>

                    {/* Comment Box (Conditionally Rendered) */}
                    {showCommentBox && (
                        <form onSubmit={handleSubmit(handleCommentPost)} className="mb-6">
                            {/* Rating Input */}
                            <div className="flex space-x-1 mb-4">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        className={`text-${index < rating ? "yellow-400" : "gray-300"} text-xl cursor-pointer`}
                                        onClick={() => setRating(index + 1)}
                                    />
                                ))}
                            </div>
                            <textarea
                                {...register("comment", { required: true })}
                                placeholder="Write your comment..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
                                rows="4"
                            ></textarea>
                            <Button
                                type="submit"
                                bgColor="bg-[#6C48E3] hover:bg-blue-700 text-white"
                                className="mt-2 px-6 py-2 rounded-md"
                            >
                                Post Comment
                            </Button>
                        </form>
                    )}

                    {/* Display Comments */}
                    <div className="space-y-4">
  {reviews.map((review, index) => (
    <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <div className="flex items-start space-x-4 mb-3">
        {/* Avatar */}
         <Link to={`/roommates/${review.user?._id}`}>{/*define this path for any user profile */}
        <img
          src={review.user?.avatar} 
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
    </Link>
        {/* Rating stars */}
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-${i < review.rating ? "yellow-400" : "gray-300"} text-lg`}
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-gray-700">{review.comment}</p>

      {/* User Info */}
      <p className="text-sm text-gray-500 mt-2">
        <span className="font-semibold">{review.user?.fullName || "Anonymous"}</span> on{" "}
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  ))}
</div>

                </div>
            </div>
        </div>
    );
}

export default Room;