import React from 'react';
import roomServices from '../../services/room.services.js';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Input, Button, Select, Authloader } from '../../components/index';
import { useId } from 'react';
const Roomform = ({ room }) => {
  const id = useId();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);
  const { register, handleSubmit, reset,watch, formState: { errors } } = useForm({
    mode: "onBlur",
    defaultValues: {
      title: room?.title || '',
      description: room?.description || '',
      price: room?.price || '',
      address: room?.location?.address || '',
      roomPhotos: room?.roomPhotos || [],
      thumbnail: room?.thumbnail || '',
      video: room?.video || '',
      capacity: room?.capacity || '',
      category: room?.category || '',
      status: room?.status || '',
      totalRooms: room?.totalRooms || '',
      rentPerMonth: room?.rentPerMonth || '',
      owner: room?.owner || user._id,
      khaltiId:room?.khaltiId || ''
    }
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null)
  React.useEffect(() => {
    if (room) {
      reset(room);
    }
  }, [room, reset]);
  const submit = async (data) => {
    try {
      setError(null)
      setLoading(true);

      const formData = new FormData();
      for (const key in data) {
        if (key === 'thumbnail' || key === 'video') {
          if (data[key] && typeof data[key] === 'object' && data[key].length > 0) {
            formData.append(key, data[key][0]); // Single file
          }
        } else if (key === 'roomPhotos') {
          if (data[key] && data[key].length > 0) {
            for (let i = 0; i < data[key].length; i++) {
              formData.append('roomPhotos', data[key][i]);
            }
          }
        } else {
          formData.append(key, data[key]); // Other fields
        }
      }

      if (room) {
        const updatedRoom = await roomServices.updateRoom(room._id, formData);
        if (!updatedRoom) {
          setError("Error updating room");
        }
        navigate(`/rooms/${room?._id}`);
      } else {
        const newRoom = await roomServices.addRoom(formData);

        if (!newRoom) {
          throw new Error("Error adding room");
        }
        navigate(`/rooms/${newRoom?.data?._id}`);
      }
    } catch (error) {
      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return !loading ? (
    <form onSubmit={handleSubmit(submit)} className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6">
  {/* Error Message - Full Width */}
  {error && (
    <div className="md:col-span-2">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p>{error || "Something went wrong while adding room. Please try again later."}</p>
      </div>
    </div>
  )}

  {/* Left Section */}
  <div className="space-y-6">
    {/* Title */}
    <div className="space-y-1">
      <Input
        label="Title"
        placeholder="Enter room title"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C48E3] focus:border-transparent"
        defaultValue={room?.title}
        {...register("title", { required: "Title is required" })}
        error={errors.title?.message}
      />
    </div>

    {/* Description */}
    <div className="space-y-1">
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <textarea
        id="description"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C48E3] focus:border-transparent"
        rows={5}
        placeholder="Describe the room details..."
        defaultValue={room?.description}
        {...register("description", { required: "Description is required" })}
      />
      {errors.description?.message && (
        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
      )}
    </div>

    {/* Thumbnail */}
    <div className="space-y-1">
      <Input
        label="Thumbnail"
        type="file"
        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#6C48E3]/10 file:text-[#6C48E3] hover:file:bg-[#6C48E3]/20"
        accept="image/png, image/jpg, image/jpeg, image/gif"
        {...register("thumbnail", { required: !room ? "Thumbnail is required" : false })}
        error={errors.thumbnail?.message}
      />
      {room && (
        <div className="mt-2">
          <img 
            src={room.thumbnail} 
            alt={room.title} 
            className="rounded-lg w-full h-48 object-cover border border-gray-200" 
          />
        </div>
      )}
    </div>
  </div>

  {/* Right Section */}
  <div className="space-y-6">
    {/* Status & Category */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Select
          options={['Available', 'Booked', 'Reserved', 'CheckedIn']}
          label="Status"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C48E3]"
          defaultValue={room?.status}
          {...register("status", { required: true })}
        />
      </div>
      <div className="space-y-1">
        <Select
          options={['Single', 'Double', '1BHK', '2BHK', '3BHK']}
          label="Category"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C48E3]"
          defaultValue={room?.category}
          {...register("category", { required: true })}
        />
      </div>
    </div>

    {/* Price Inputs */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <Input
          label="Agent Fee (NPR)"
          type="text"
          placeholder="0.00"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C48E3]"
          {...register("price", {
            required: "Price is required",
            validate: (value) => {
              if (!/^\d+(\.\d{1,2})?$/.test(value)) return "Enter a valid price";
              return true;
            }
          })}
          error={errors.price?.message}
        />
      </div>
      <div className="space-y-1">
        <Input
          label="Rent (NPR)"
          type="text"
          placeholder="0.00"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C48E3]"
          {...register("rentPerMonth", {
            required: "Rent is required",
            validate: (value) => {
              if (!/^\d+(\.\d{1,2})?$/.test(value)) return "Enter a valid price";
              return true;
            }
          })}
          error={errors.rentPerMonth?.message}
        />
      </div>
    </div>

    {/* Capacity & Rooms */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Input
          label="Capacity"
          type="number"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C48E3]"
          defaultValue={room?.capacity}
          {...register("capacity", { required: "Capacity is required" })}
          error={errors.capacity?.message}
        />
      </div>
      <div className="space-y-1">
        <Input
          label="Total Rooms"
          type="number"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C48E3]"
          defaultValue={room?.totalRooms}
          {...register("totalRooms", { required: "Total Rooms is required" })}
          error={errors.totalRooms?.message}
        />
      </div>
    </div>

    {/* Room Photos */}
    <div className="space-y-1">
      <Input
        label="Room Photos (max 4)"
        type="file"
        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#6C48E3]/10 file:text-[#6C48E3] hover:file:bg-[#6C48E3]/20"
        accept="image/png, image/jpg, image/jpeg, image/gif"
        multiple
        {...register("roomPhotos", { required: !room ? "Photos are required" : false })}
        error={errors.roomPhotos?.message}
      />
      {room && room.roomPhotos?.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {room.roomPhotos.map((photo) => (
            <img 
              key={photo} 
              src={photo} 
              alt={room.title} 
              className="rounded-lg w-full h-24 object-cover border border-gray-200"
            />
          ))}
        </div>
      )}
    </div>

    {/* Video */}
    {!room && (
      <div className="space-y-1">
        <Input
          label="Room Video (less than 10 MB)"
          type="file"
          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#6C48E3]/10 file:text-[#6C48E3] hover:file:bg-[#6C48E3]/20"
          accept="video/mp4, video/webm"
          {...register("video", { required: !room ? "Video is required" : false })}
          error={errors.video?.message}
        />
      </div>
    )}
    {room?.video && (
      <div className="mt-2">
        <video controls className="w-full rounded-lg border border-gray-200">
          <source src={room.video} type="video/mp4" />
        </video>
      </div>
    )}

    {/* Payment Section */}
    {!room && (
      <div className="space-y-4">
        <div className="space-y-1">
          <Select
            options={['E-SEWA', 'Khalti']}
            label="Payment Method"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C48E3]"
            defaultValue={room?.category}
            {...register("paymentType", { required: true })}
          />
        </div>
        
        {watch('paymentType') === 'E-SEWA' ? (
          <div className="space-y-1">
            <Input
              label="Esewa ID"
              type="tel"
              inputMode="numeric"
              placeholder="98665XXXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C48E3]"
              defaultValue={room?.esewaId}
              {...register("esewaId", {
                required: "Esewa ID is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Must be 10 digits"
                }
              })}
              error={errors.esewaId?.message}
            />
          </div>
        ) : (
          <div className="space-y-1">
            <Input
              label="Khalti ID"
              type="tel"
              inputMode="numeric"
              placeholder="98665XXXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C48E3]"
              defaultValue={room?.khaltiId}
              {...register("khaltiId", {
                required: "Khalti ID is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Must be 10 digits"
                }
              })}
              error={errors.khaltiId?.message}
            />
          </div>
        )}
      </div>
    )}
  </div>

  {/* Submit Button */}
  <div className="md:col-span-2 mt-4">
    <button
      type="submit"
      disabled={loading}
      className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
        loading 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-[#6C48E3] text-white hover:bg-[#5a3acf]"
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {room ? "Updating..." : "Submitting..."}
        </span>
      ) : (
        room ? "Update Room" : "Submit Room"
      )}
    </button>
  </div>
</form>
  ) : (
    <Authloader message="Uploading... this may take some time." />
  )
};

export default Roomform;