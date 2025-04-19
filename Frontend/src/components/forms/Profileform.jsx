import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth.services.js';
import {Input} from '../../components/index.js';

function Profileform({ myProfile }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    // resolver: yupResolver(profileSchema),
    defaultValues: myProfile || {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      gender: '',
    },
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [avatarPreview, setAvatarPreview] = React.useState(myProfile?.avatar || '');
  const [coverPreview, setCoverPreview] = React.useState(myProfile?.coverImage || '');
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('avatar', file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('coverImage', file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const updateProfile = async (data) => {
    const refreshCurrentRoute = () => {
      // Force re-render by changing state
      setRefreshKey(prev => prev + 1);
      
      // Optionally add a small delay for smoother UX
      setTimeout(() => {
        navigate(location.pathname, {
          state: { refresh: Date.now() }, // Unique value
          replace: true
        });
      }, 100);
    };
    const nonFileData = Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'avatar' && key !== 'coverImage'));
    const formData = new FormData();
    formData.append('avatar', data.avatar);
    formData.append('coverImage', data.coverImage);
    try {
      setUpdateLoading(true);
      await authService.updateProfile(nonFileData);
      if (typeof data?.avatar === 'object') {
        await authService.updateProfilePic(formData);
      }

      if (typeof data?.coverImage === 'object') {
        // coverImageFormData.append('coverImage', data[coverImage]);
        await authService.updateCoverImage(formData);
      }
      if (location.pathname === '/users/myprofile') {
        refreshCurrentRoute();
      } else {
        navigate('/users/myprofile');
      }

    } catch (error) {
      console.error("Error updating profile:", error);
    }finally {
      setUpdateLoading(false);
    }

  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-200 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>

      <form onSubmit={handleSubmit(updateProfile)} className="space-y-6">
        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
          <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden mb-2">
            {coverPreview ? (
              <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No cover image selected
              </div>
            )}
          </div>
          <Input
            type="file"
            id="coverImage"
            accept="image/*"
            onChange={handleCoverChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* Avatar */}
        <div className="flex items-center space-x-6">
          <div className="shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <div className="relative">
              <img
                className="h-16 w-16 object-cover rounded-full"
                src={avatarPreview}
                alt="Profile"
              />
              <label
                htmlFor="avatar"
                className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
              <Input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <Input
            label="Full Name"
            type="text"
            id="fullName"
            {...register('fullName')}
            className={`${errors.fullName ? 'border-red-500' : 'border'
              }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Input
            label="Email"
            type="email"
            id="email"
            {...register('email')}
            className={`${errors.email ? 'border-red-500' : 'border'
              }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          
          <Input
            label="Phone Number"
            type="tel"
            id="phone"
            {...register('phone')}
            className={`${errors.phone ? 'border-red-500' : 'border'
              }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            id="address"
            rows={3}
            {...register('address')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.address ? 'border-red-500' : 'border'
              }`}
          />
        </div>


        {/* Submit Button */}
        <div className="flex justify-end">
          {!updateLoading?(<button
            type="submit"
            className="inline-flex justify-center rounded-md border border-[#6C48E3] bg-[#F2F4F7] py-2 px-4 text-sm font-medium text-[#6C48E3] shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            Save Changes
          </button>
          ):(<button
          type="submit"
          disabled
          className="inline-flex justify-center rounded-md border border-[#6C48E3] bg-[#F2F4F7] py-2 px-4 text-sm font-medium text-[#6C48E3] shadow-sm hover:bg-gray-50 focus:outline-none"
        >
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#6C48E3]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        </button>)}
        </div>
      </form>
    </div>
  );
}

export default Profileform;
