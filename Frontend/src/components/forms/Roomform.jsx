import React from 'react';
import roomServices from '../../services/room.services.js';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Input, Button, Select, Authloader } from '../../components/index';
import { useId } from 'react';
const Roomform = ({ room }) => {
  // console.log(room);
  
  const id = useId();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);
  const { register, handleSubmit,reset,formState: { errors} } = useForm({
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
      owner: room?.owner || user._id
    }
  });
  const [loading, setLoading] = React.useState(false);
  const [error,setError]=React.useState(null)
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
          if (data[key] && data[key].length > 0  ) {
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
        navigate(`/rooms/${newRoom?._id}`);
      }
    } catch (error) {
      setError(error)
    }finally{
      setLoading(false);
    }
  };

  return !loading?(
    <form onSubmit={handleSubmit(submit)} className="w-full grid grid cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {/* Left Section (2 columns) */}
      {error && <div className="bg-red-500 text-white p-2 rounded-lg">{error.response.data.error ||"Something went wrong While adding room please try again later"}</div>}
      <div className="md:col-span-2 space-y-4">
        <Input
          label="Title :"
          placeholder="Title"
          className="w-full"
          defaultValue={room?.title}
          {...register("title", { required: "Title is required" })}
          error={errors.title?.message}
        />

        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description:
        </label>
        <textarea
          id="description"
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
          rows={4}
          defaultValue={room?.description}
          {...register("description", { required: "Description is required" })}
          error={errors.description?.message}
        />

        <Input
          label="Thumbnail :"
          type="file"
          className="w-full"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("thumbnail", { required: !room? "Thumbnail is required" : false  })}
          error={errors.thumbnail?.message}
        />
        {room && (
          <div className="w-full">
            <img src={room.thumbnail} alt={room.title} className="rounded-lg w-full" />
          </div>
        )}

        <Select
          options={['Available', 'Booked', 'Reserved', 'CheckedIn']}
          label="Status"
          className="w-full"
          defaultValue={room?.status}
          {...register("status", { required: true })}
        />

        <Select
          options={['Single', 'Double', '1BHK', '2BHK', '3BHK']}
          label="Category"
          className="w-full"
          defaultValue={room?.category}
          {...register("category", { required: true })}
        />

        {!room && (<Input
          type="text"
          label="Location"
          className="w-full"
          defaultValue={room?.location?.address}
          {...register("address", { required: "Location is required" })}
          error={errors.address?.message}
        />)}
      </div>

      {/* Right Section (1 column) */}
      <div className="md:col-span-1 space-y-4">
        <Input
          type="number"
          label="Price :"
          className="w-full p-3 border rounded-lg appearance-none"
          {...register("price", { required: "Price is required" })}
          error={errors.price?.message}
        />

        <Input
          label="Capacity :"
          type="number"
          className="w-full"
          defaultValue={room?.capacity}
          {...register("capacity", { required: "Capacity is required" })}
          error={errors.capacity?.message}
        />

        <Input
          label="Total Rooms :"
          type="number"
          className="w-full"
          defaultValue={room?.totalRooms}
          {...register("totalRooms", { required: "Total Rooms is required" })}
          error={errors.totalRooms?.message}
        />

        <Input
          label="Rent Per Month :"
          type="number"
          className="w-full"
          defaultValue={room?.rentPerMonth}
          {...register("rentPerMonth", { required: "Rent Per Month is required" })}
          error={errors.rentPerMonth?.message}
        />

        <Input
          label="Room Photos :"
          type="file"
          className="w-full"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          multiple
          {...register("roomPhotos", { required: !room? "Room Photos is required" : false })}
          error={errors.roomPhotos?.message}
        />
        {room && (
          <div className="w-full">
            {room?.roomPhotos?.map((photo) => (
              <img key={photo} src={photo} alt={room.title} className="rounded-lg w-full" />
            ))}
          </div>
        )}

        {!room && (<Input
          label="Video :"
          type="file"
          className="w-full"
          accept="video/mp4, video/webm"
          {...register("video",{ required: !room? "Room Video is required" : false })}
          error={errors.video?.message}
        />)}
        {room && (
          <div className="w-full">
            <video controls>
              <source src={room.video} type="video/mp4" />
            </video>
          </div>
        )}

        <Input
          label="Esewa Id :"
          type="tel"
          inputMode="numeric"
          placeholder="98665....."
          className="w-full"
          defaultValue={room?.esewaId}
          {...register("esewaId", {
            required: "Esewa Id is required",
            pattern: /^[0-9]{10}$/,
            message: "Esewa Id must be 10 digits",
          })}
          error={errors.esewaId?.message}
        />
      </div>

      {/* Submit Button - Full Width */}
      <div className="col-span-3">
        {
        !loading?(<Button
          type="submit"
          //bgColor={room ? "bg-[#F2F4F7] text-[#6C48E3]" : undefined}
          className="w-full border hover:bg-gray-100 border-[#6C48E3] hover:text-[#6C48E3]"
        >
          {room ? "Update" : "Submit"}
        </Button>)
        :
        (
          <Button
          type="submit"
          disabled
          bgColor={room ? "bg-[#F2F4F7]" : undefined}
          className="w-full border border-[#6C48E3] hover:text-[#6C48E3]"
        >
          {room ? "Updating..." : "Submitting..."}
        </Button>
        )
        }
      </div>
    </form>
  ):(
    <Authloader message="Uploading... this may take some time."/>
  )
};

export default Roomform;