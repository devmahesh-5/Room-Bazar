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
            throw error
        }finally{
            setLoading(false);
        }
    }
    return (

        <div className="flex w-full max-w-4xl mx-auto bg-[#F2F4F7]">
    {/* Form Section (2/3 width) */}
    <form onSubmit={handleSubmit(submit)} className="w-full grid grid-cols-3 gap-4 p-4">
        {/* Left Section (2 columns) */}
        <div className="col-span-2 space-y-4">
            <Input
                label="Job :"
                placeholder="Enter job title"
                className="w-full"
                defaultValue={roommate?.job}
                {...register("job", { required: true })}
            />

            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description:
            </label>
            <textarea
                id="description"
                className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-[#6C48E3]"
                rows={4}
                defaultValue={roommate?.description}
                {...register("description", { required: "Description is required" })}
            />
            <div className='w-full flex items-center'>
    <div className="w-1/3 flex items-center">
        <label className="mr-2" htmlFor='smoking'>Smoke:</label>
        <input
            type="checkbox"
            id='smoking'
            defaultValue={roommate?.smoking}
            className="w-4 h-4"  
            {...register("smoking")}
        />
    </div>
    <div className="w-1/3 flex items-center">
        <label className="mr-2" htmlFor='haveRoom'>HaveRoom:</label>
        <input
            type="checkbox"
            id='haveRoom'
            className="w-4 h-4"  // Adjust checkbox size
            defaultValue={roommate?.haveRoom}
            {...register("haveRoom")}
        />
    </div>
    <div className="w-1/3 flex items-center">
        <Input
            type="text"
            label="Pets:"
            className="w-2/3 p-1 border rounded"  // Style for text input
            defaultValue={roommate?.pets}
            {...register("pets", { required: !roommate })}
        />
    </div>
</div>
            {roommate?.roomPhotos?.length > 0 && (
                <div className="w-full">
                    <img src={roommate?.roomPhotos[0]} alt={roommate.user.fullName} className="rounded-lg w-full" />
                </div>
            )}


            <Input
                type="text"
                label="Location"
                className="w-full"
                defaultValue={roommate?.location?.address}
                {...register("address", { required: true })}
            />

            <Input
                            label="Room Photos :"
                            type="file"
                            className="w-full"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            multiple
                            {...register("roomPhotos")}
                        />

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
