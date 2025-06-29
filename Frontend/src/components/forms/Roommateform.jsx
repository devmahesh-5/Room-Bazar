import React from 'react'
import roommateServices from '../../services/roommate.services.js'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Input, Button, Select } from '../../components/index';
import { useId } from 'react';
const Roommateform = ({ roommate }) => {
    const [loading, setLoading] = React.useState(false);
    const id = useId();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.userData);
    const [error,setError]=React.useState(null)
    const { register, handleSubmit,reset } = useForm({
        defaultValues: {
            job: roommate?.job || '',
            pets: roommate?.pets || false,
            smoking: roommate?.smoking || false,
            haveRoom: roommate?.haveRoom || false,
            description: roommate?.description || '',
            roomThumbnail: roommate?.roomPhotos[0] || '',
        }
    });

    React.useEffect(() => {
        if (roommate) {
            reset(roommate);
        }
    }, [roommate, reset]);
    
    const submit = async (data) => {
        
        try {
            setLoading(true);
            const formData = new FormData();
            for (const key in data) {
                if (key === 'roomPhotos') {
                    if (data[key] && data[key].length > 0) {
                        for (let i = 0; i < data[key].length; i++) {
                            formData.append('roomPhotos', data[key][i]);
                        }
                    }
                } else {
                        formData.append(key, data[key]);
                } 
            }

            
            if (roommate) {
                const updatedRoommate = await roommateServices.updateRoommate(formData);
                if (!updatedRoommate) {
                    throw new Error("Error updating room");
                }
                navigate(`/roommates`);
            } else {
                
                const newRoommate = await roommateServices.registerRoommate(formData);
                
                if (!newRoommate) {
                    throw new Error("Error adding roommate");
                }
                navigate(`/roommates`);
            }

        } catch (error) {
            setError(error.response.data.error);
        }finally{
            setLoading(false);
        }
    }
    return (

        <div className="flex w-full max-w-4xl mx-auto bg-[#F2F4F7]">
    {/* Form Section (2/3 width) */}
    <form onSubmit={handleSubmit(submit)} className="w-full grid grid-cols-3 gap-4 p-4">
        {/* Left Section (2 columns) */}
        <div className="col-span-2 space-y-4 md:space-y-6">
  {/* Job Input */}
  <div className="space-y-1">
    <Input
      label="Job:"
      placeholder="Enter job title"
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6C48E3] focus:border-transparent"
      defaultValue={roommate?.job}
      {...register("job", { required: true })}
    />
   {/*  {errors.job && <p className="text-sm text-red-500">Job is required</p>} */}
  </div>

  {/* Description Textarea */}
  <div className="space-y-1">
    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
      Description:
    </label>
    <textarea
      id="description"
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C48E3] focus:border-transparent min-h-[120px]"
      defaultValue={roommate?.description}
      {...register("description", { required: "Description is required" })}
    />
    {/* {errors.description && (
      <p className="text-sm text-red-500">{errors.description.message}</p>
    )} */}
  </div>

  {/* Checkboxes and Pets Input - Responsive Row */}
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
    {/* Smoking Checkbox */}
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="smoking"
        className="w-5 h-5 rounded border-gray-300 text-[#6C48E3] focus:ring-[#6C48E3]"
        defaultChecked={roommate?.smoking}
        {...register("smoking")}
      />
      <label htmlFor="smoking" className="text-sm font-medium text-gray-700">
        Smoker
      </label>
    </div>

    {/* Have Room Checkbox */}
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="haveRoom"
        className="w-5 h-5 rounded border-gray-300 text-[#6C48E3] focus:ring-[#6C48E3]"
        defaultChecked={roommate?.haveRoom}
        {...register("haveRoom")}
      />
      <label htmlFor="haveRoom" className="text-sm font-medium text-gray-700">
        Has Room
      </label>
    </div>

    {/* Pets Input */}
    <div className="flex-1 min-w-0">
      <Input
        type="text"
        label="Pets:"
        placeholder="Specify pets"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6C48E3] focus:border-transparent"
        defaultValue={roommate?.pets || ''}
        {...register("pets", { required: !roommate })}
      />
    </div>
  </div>

  {/* Room Photo Display */}
  {roommate?.roomPhotos?.length > 0 && (
    <div className="w-full overflow-hidden rounded-lg bg-gray-100">
      <img 
        src={roommate.roomPhotos[0]} 
        alt={`Room of ${roommate.user.fullName}`} 
        className="w-full h-auto object-cover"
      />
    </div>
  )}

  {/* Location Input */}
  <div className="space-y-1">
    <Input
      label="Location:"
      placeholder="Enter address"
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6C48E3] focus:border-transparent"
      defaultValue={roommate?.location?.address}
      {...register("address", { required: true })}
    />
    {/* {errors.address && <p className="text-sm text-red-500">Address is required</p>} */}
  </div>

  {/* Room Photos Upload */}
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Room Photos:
    </label>
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF (MAX. 5MB each)
          </p>
        </div>
        <input 
          type="file" 
          className="w-1/2 h-1/2" 
          accept="image/png, image/jpg, image/jpeg, image/gif"
          multiple
          {...register("roomPhotos")}
        />
      </label>
    </div>
  </div>
</div>

        
        {/* Submit Button - Full Width */}
        <div className="col-span-3">
       {!loading ? (<Button type="submit" className={`w-full border hover:bg-[#F2F4F7] hover:border-[#6C48E3] hover:text-[#6C48E3]`}>
   {roommate ? "Update" : "Submit"}
            </Button>):
            (
                <Button type="submit" className={`w-full border hover:bg-[#F2F4F7] hover:border-[#6C48E3] hover:text-[#6C48E3]`}>
                    {roommate ? "Updating" : "Submiting"}
                </Button>
            )
            }
        </div>
    </form>

    
</div>


    )
}


export default Roommateform
