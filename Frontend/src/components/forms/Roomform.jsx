import React from 'react';
import roomServices from '../../services/room.services.js';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Input, Button, Select } from '../../components/index';
import { useId } from 'react';

const Roomform = ({ room }) => {
  const id = useId();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);
  const { register, handleSubmit } = useForm();

  const submit = async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        if (key === 'thumbnail' || key === 'video') {
          if (data[key] && data[key].length > 0) {
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
          throw new Error("Error updating room");
        }
        navigate(`/rooms/${updatedRoom._id}`);
      } else {
        const newRoom = await roomServices.addRoom(formData);
        if (!newRoom) {
          throw new Error("Error adding room");
        }
        navigate(`/rooms/${newRoom._id}`);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full grid grid-cols-3 gap-4 p-4">
      {/* Left Section (2 columns) */}
      <div className="col-span-2 space-y-4">
        <Input
          label="Title :"
          placeholder="Title"
          className="w-full"
          defaultValue={room?.title}
          {...register("title", { required: true })}
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
        />

        <Input
          label="Thumbnail :"
          type="file"
          className="w-full"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("thumbnail", { required: !room })}
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

        <Input
          type="text"
          label="Location"
          className="w-full"
          defaultValue={room?.location.address}
          {...register("address", { required: true })}
        />
      </div>

      {/* Right Section (1 column) */}
      <div className="col-span-1 space-y-4">
        <Input
          type="number"
          label="Price :"
          className="w-full p-3 border rounded-lg appearance-none"
          {...register("price", { required: true })}
        />

        <Input
          label="Capacity :"
          type="number"
          className="w-full"
          defaultValue={room?.capacity}
          {...register("capacity", { required: true })}
        />

        <Input
          label="Total Rooms :"
          type="number"
          className="w-full"
          defaultValue={room?.totalRooms}
          {...register("totalRooms", { required: true })}
        />

        <Input
          label="Rent Per Month :"
          type="number"
          className="w-full"
          defaultValue={room?.rentPerMonth}
          {...register("rentPerMonth", { required: true })}
        />

        <Input
          label="Room Photos :"
          type="file"
          className="w-full"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          multiple
          {...register("roomPhotos", { required: !room })}
        />

        <Input
          label="Video :"
          type="file"
          className="w-full"
          accept="video/mp4, video/webm"
          {...register("video")}
        />

        <Input
          label="Esewa Id :"
          type="tel"
          inputMode="numeric"
          placeholder="98665....."
          className="w-full"
          defaultValue={room?.esewaId}
          {...register("esewaId", {
            required: true,
            pattern: /^[0-9]{10}$/,
            message: "Esewa Id must be 10 digits",
          })}
        />
      </div>

      {/* Submit Button - Full Width */}
      <div className="col-span-3">
        <Button
          type="submit"
          bgColor={room ? "bg-green-500" : undefined}
          className="w-full border hover:bg-[#F2F4F7] hover:border-[#6C48E3] hover:text-[#6C48E3]"
        >
          {room ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default Roomform;