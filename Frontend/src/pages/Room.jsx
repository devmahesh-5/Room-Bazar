import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import roomServices from "../services/room.services.js";
import favouriteService from "../services/favourite.services.js";
import { Button } from "../components";
import { useSelector } from "react-redux";
import { FaHeart, FaBook, FaStar, FaComment, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import reviewService from "../services/review.services.js";
import { set, useForm } from "react-hook-form";
import {Authloader} from "../components/index.js";
function Room() {
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const slug = useParams();
    const [reviews, setReviews] = useState([]);
    const [room, setRoom] = useState(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [showCommentBox, setShowCommentBox] = useState(false); // State to toggle comment box
    const [rating, setRating] = useState(1); // State for user's rating
    const [averageRating, setAverageRating] = useState(0); // State for average room rating
    const userData = useSelector((state) => state.auth.userData);
    const isOwner = room && userData ? room.owner?._id === userData._id : false;
    const { register, handleSubmit, reset } = useForm();
    const [commentError, setCommentError] = useState(null);
    const [commentLoading, setCommentLoading] = useState(false);
    const [reviewsError, setReviewsError] = useState(null);
    const [favAndDeleteError, setFavAndDeleteError] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (slug?.id) {
            (async () => {
                try {
                    const response = await roomServices.getRoomById(slug.id);
                    setRoom(response.data[0]); // Store the room in state
                } catch (error) {
                    setError(error);
                }
                 // Fetch reviews and calculate average rating
                    try {
                        const reviewResponse = await reviewService.getRoomReviews(slug.id);
                        if (reviewResponse) {
                            setReviews(reviewResponse.data);
                            calculateAverageRating(reviewResponse.data); // Calculate average rating
                        }
                    } catch (error) {
                        setReviewsError(error.response.data.error);
                    }
                //favourites
                try {
                        const favResponse = await favouriteService.getFavouriteByRoomId(slug.id);
                        if (favResponse) {
                            setIsFavourite(true);
                        }
                    } catch (error) {
                        setIsFavourite(false);
                    }
            })();
        }
    }, [slug?.id]);

    const deleteRoom = async () => {
        try {
            setFavAndDeleteError(null);
            setLoading(true);
            const response = await roomServices.deleteRoom(slug.id);
            if (response) {
                navigate("/rooms");
            }
        } catch (error) {
            setFavAndDeleteError(error.response.data.error);
        }finally{
            setLoading(false);
        }
    };
    
    useEffect(() => {
    if (favAndDeleteError) {
        const timer = setTimeout(() => {
            setFavAndDeleteError(null);
        }, 3000);
        return () => clearTimeout(timer);
    }
}, [favAndDeleteError]);
    
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
            setCommentError(null);
            setCommentLoading(true);
            await reviewService.addReview(room._id, { ...data, rating });
            // Refresh reviews after posting
            const reviewResponse = await reviewService.getRoomReviews(slug.id);
            setReviews(reviewResponse.data);
            calculateAverageRating(reviewResponse.data);
            reset(); // Reset the form
            setShowCommentBox(false); // Hide the comment box after submission
        } catch (error) {
            setCommentError(error.response.data.error);
        }finally{
            setCommentLoading(false);
        }
    };

    const handleBook = async () => {
        setBookingLoading(true);
        try {
            const bookingResponse = await roomServices.bookRoom(room?._id);
            if (bookingResponse) {
                navigate(`/rooms/payment/${room._id}/${bookingResponse?.data?.price}`);
            }
        } catch (error) {
            setError(error.response.data.error);
        }finally{
            setBookingLoading(false);
        }
            
    };

    const handleFavourite = () => {
            setFavAndDeleteError(null);
            favouriteService.toggleFavourite(room._id).then((response) => {
            setIsFavourite(response.data.isFavourite);
            }).catch((error) => {
                setFavAndDeleteError(error.response.data.error);
            });
       
    };
    
    // Toggle comment box visibility
    const toggleCommentBox = () => {
        setCommentError(null);
        setShowCommentBox(!showCommentBox);
    };

    if (!room && error && typeof error === "string") {
        return <div className="flex justify-center items-center h-screen">{error}</div>;
    }

    const thumbnail = room?.thumbnail || (room?.roomPhotos && room?.roomPhotos[0]);

    return !loading && !bookingLoading? (
        <div className="py-10 px-4 max-w-6xl mx-auto">
       { favAndDeleteError && (<div className="bg-[#F2F4F7] p-2 absolute top-4 right-6 transform -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-xl text-red-600 text-center">{favAndDeleteError}<span className="absolute bottom-0 left-0 bg-[#F2F4F7] h-0.5 animate-underline z-10"></span></h2>
        </div>)}
    
            {/* Room Image and Owner Info Section */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
                {/* Room Image */}
                <div className="lg:w-2/3 relative rounded-2xl overflow-hidden shadow-lg">
                    <img
                        src={thumbnail}
                        alt={room?.title}
                        className="w-full h-96 object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                    />
                    {isOwner && (
                        <div className="absolute right-6 top-6 flex space-x-4">
                            <Link to={`/rooms/update/${room?._id}`}>
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

                {/* Owner Information Card */}
                <div className="lg:w-1/3 bg-white rounded-xl shadow-md p-6 h-fit sticky top-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Property Owner</h2>
                    <div className="flex items-center space-x-4 mb-6">
                        <img
                            src={room?.owner?.avatar}
                            alt="Owner"
                            className="w-16 h-16 rounded-full object-cover border-2 border-[#6C48E3]"
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{room?.owner?.fullName || "Owner"}</h3>
                            <p className="text-gray-600 flex items-center">
                                <FaMapMarkerAlt className="mr-1 text-[#6C48E3]" />
                                {room?.location?.address}
                            </p>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <FaPhone className="text-[#6C48E3]" />
                            <span className="text-gray-700">{room?.owner?.phone || "Not provided"}</span>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                            <h4 className="font-medium text-gray-800 mb-2">Room Details</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-[#F2F4F7] p-2 rounded">
                                    <p className="text-xs text-gray-500">Price</p>
                                    <p className="font-semibold">Rs. {room?.price}</p>
                                </div>
                                <div className="bg-[#F2F4F7] p-2 rounded">
                                    <p className="text-xs text-gray-500">Rent/Month</p>
                                    <p className="font-semibold">Rs. {room?.rentPerMonth}</p>
                                </div>
                                <div className="bg-[#F2F4E3] p-2 rounded">
                                    <p className="text-xs text-gray-500">Rooms</p>
                                    <p className="font-semibold">{room?.totalRooms}</p>
                                </div>
                                <div className="bg-[#F2F4E3] p-2 rounded">
                                    <p className="text-xs text-gray-500">Capacity</p>
                                    <p className="font-semibold">{room?.capacity}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Room Details */}
            <div className="space-y-6 bg-white rounded-xl shadow-md p-6 mb-8">
                {/* Title and Category */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <h1 className="text-3xl font-bold text-gray-800">{room?.title}</h1>
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                        Category: {room?.category}
                    </span>
                </div>

                {/* Description */}
                <div className="prose max-w-none text-gray-700">
                    <p className="text-lg leading-relaxed">{room?.description}</p>
                </div>

                {/* Room Photos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {room?.roomPhotos?.map((photo, index) => (
                        <img
                            key={index}
                            src={photo}
                            alt={`Room Photo ${index + 1}`}
                            className="w-full h-64 object-cover rounded-lg shadow-sm"
                        />
                    ))}
                </div>

                {/* Video (if available) */}
                {room?.video && (
                    <div className="w-full mt-6">
                        <video controls className="w-full rounded-lg shadow-sm">
                            <source src={room?.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </div>

            {/* Action Buttons (for non-owners) */}
            {!isOwner && room?.status === "Available" && (
                <div className="flex flex-wrap gap-4 mb-8">
                    <Button
                        bgColor="bg-[#6C48E3] border border-[#6C48E3] hover:bg-blue-700 text-white"
                        onClick={handleBook}
                        className="px-6 py-3 rounded-lg flex items-center space-x-2"
                    >
                        <FaBook className="text-lg" />
                        <span>Book Now</span>
                    </Button>
                    <Button
                        bgColor="[#F2F4F7]"
                        onClick={handleFavourite}
                        className="px-6 py-3 rounded-lg flex items-center space-x-2"
                    >
                        <FaHeart className="text-lg text-red-600" />
                        <span className={`${isFavourite ? "text-red-600" : "text-gray-600"}`}>{isFavourite ? "Remove Favorite" : "Add to Favorites"}</span>
                    </Button>
                    <Button
                        bgColor="bg-[#F2F4F7]"
                        onClick={toggleCommentBox}
                        className="px-6 py-3 rounded-lg flex items-center space-x-2"
                    >
                        <FaComment className="text-lg text-[#6C48E3]" />
                        <span className="text-[#6C48E3]">Review</span>
                    </Button>
                </div>
            )}

            {/* Rating and Reviews Section */}
           { !reviewsError?(<div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                            <FaStar className="text-yellow-400 text-xl mr-1" />
                            <span className="font-semibold">{averageRating}</span>
                            <span className="text-gray-500 ml-1">({reviews?.length} reviews)</span>
                        </div>
                    </div>
                </div>

                {/* Comment Box (Conditionally Rendered) */}
                {showCommentBox &&!commentError ? (
                    <form onSubmit={handleSubmit(handleCommentPost)} className="mb-8 bg-white p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Write a Review</h3>
                        {!commentLoading &&(
                            <div>
                            <div className="flex space-x-1 mb-4">
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    className={`text-2xl cursor-pointer ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
                                    onClick={() => setRating(index + 1)}
                                />
                            ))}
                        </div>
                        <textarea
                            {...register("comment", { required: true })}
                            placeholder="Share your experience..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
                            rows="4"
                        ></textarea>
                        </div>
                        )}
                        <Button
                            type="submit"
                            bgColor="bg-[#6C48E3] hover:bg-blue-700 text-white"
                            className={`mt-3 px-6 py-2 rounded-lg ${commentLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {commentLoading ? "Posting..." : "Post"}
                        </Button>
                    </form>
                ):(
                    <div className="mb-8 p-4 rounded-lg">
                        <p className="text-red-600">{commentError}</p>
                    </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                            <div className="flex items-start space-x-4">
                                <Link to={`/roommates/${review.user?._id}`}>
                                    <img
                                        src={review.user?.avatar || "https://via.placeholder.com/150"}
                                        alt="User"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </Link>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{review.user?.fullName || "Anonymous"}</h4>
                                            <div className="flex space-x-1 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-gray-700">{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>):(
                <div className="bg-[#F2F4F7] rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-red-600 text-center">{reviewsError}</h2>
                </div>
            )}
        </div>
    ):!bookingLoading?(
        <Authloader fullScreen={true} message='please wait deleting room...' />
    ):bookingLoading?(
        <Authloader fullScreen={true} message='please wait Reserving room...' />
    ):null;
}

export default Room;