import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.services.js";
import { useDispatch } from "react-redux";
import { Button, Input, Logo, Select, Authloader } from "./index.js";
import { useForm } from "react-hook-form";
import { generateFromEmail, generateUsername } from "unique-username-generator";

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [passwordType, setPasswordType] = useState("password");
    const { 
        register, 
        handleSubmit,
        formState: { errors } // Access validation errors
    } = useForm({ 
        defaultValues: { username: generateUsername() },
        mode: "onBlur" // Validate fields when they lose focus
    });
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const signUp = async (data) => {
        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("phone", data.phone);
        formData.append("gender", data.gender);
        formData.append("address", data.address);
        formData.append('username', data.username);
        formData.append('role', data.role);
        if (data.avatar[0]) {
            formData.append("avatar", data.avatar[0]);
        }
        if (data.coverImage[0]) {
            formData.append("coverImage", data.coverImage[0]);
        }

        try {
            const userSession = await authService.registerUser(formData, data.email);
            if (userSession) {
                setLoading(false);
                navigate(`/users/verify-otp/${userSession.data.email}`);
            }
        } catch (error) {
            setError(error.response?.data || error.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };
    
   return !loading ? (
  <div className="w-full min-h-screen flex items-center justify-center bg-[#F2F4F7] p-4">
    <div className="w-full max-w-2xl bg-[#F2F4F7] rounded-2xl shadow-lg p-8">
      <div className="mb-6 flex justify-center">
        <span className="inline-block w-24">
          <Logo width="100%"/>
        </span>
      </div>

      <h2 className="text-center text-3xl font-bold text-[#6C48E3] mb-2">
        Create Your Account
      </h2>

      <p className="text-center text-gray-600 mb-8">
        Join our community and start your journey
      </p>

      {error && typeof error === "string" && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(signUp)}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
          <div className={`space-y-5`}>
            <Input
              type="text"
              label="Full Name"
              placeholder="Ram Bahadur"
              {...register("fullName", { required: "Full name is required" })}
              error={errors.fullName?.message}
            />

            <Input
              type="email"
              label="Email Address"
              placeholder="rambhadur@gmail.com"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              error={errors.email?.message}
            />

            <Input
              type="text"
              label="Username"
              placeholder="ram_bahadur"
              {...register("username", { 
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters"
                }
              })}
              error={errors.username?.message}
            />
            
            <div className="relative">
              <Input
                type={passwordType}
                label="Password"
                placeholder="••••••••"
                className="pr-10"
                {...register("password", {
                  required: "Password is required",
                  validate: (value) => {
                    if (value.length < 8) return "At least 8 characters";
                    if (value.length > 20) return "Maximum 20 characters";
                    if (!/[A-Za-z]/.test(value)) return "Must include a letter";
                    if (!/\d/.test(value)) return "Must include a number";
                    return true;
                  }
                })}
                error={errors.password?.message}
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] p-1 text-[#6C48E3] hover:text-indigo-600 transition-colors focus:outline-none rounded-md"
                onClick={() => setPasswordType(passwordType === 'password' ? 'text' : 'password')}
                aria-label={passwordType === 'password' ? 'Show password' : 'Hide password'}
              >
                {passwordType != 'password' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              <p>Password must contain:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>8-20 characters</li>
                <li>At least one letter</li>
                <li>At least one number</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Always visible */}
          <div className="space-y-5">
            <Input
              type="text"
              label="Current Address"
              placeholder="City"
              {...register("address", { required: "Address is required" })}
              error={errors.address?.message}
            />

            <Input
              type="tel"
              inputMode="numeric"
              label="Phone Number"
              placeholder="9800000000"
              {...register("phone", { 
                required: "Phone number is required",
                pattern: {
                  pattern: /^[0-9]{10}$/,
                  message: "Invalid phone number (10 digits required)"
                },
                validate: (value) => {
                  if (value.length !== 10) return "Invalid phone number (10 digits required)";
                  return true;
                }
              })}
              error={errors.phone?.message}
            />

            <Select
              options={["Male", "Female"]}
              label="Gender"
              {...register("gender", { required: "Gender is required" })}
              className="w-full"
              error={errors.gender?.message}
            />

            <div className="space-y-4">
              <span className="text-sm font-bold text-[#6C48E3]">optional fields</span>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#6C48E3] file:text-white
                    hover:file:bg-[#5a3acf]"
                  {...register("avatar")}
                />
                {errors.avatar && (
                  <p className="mt-1 text-sm text-red-600">{errors.avatar.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Cover Image</label>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#6C48E3] file:text-white
                    hover:file:bg-[#5a3acf]"
                  {...register("coverImage")}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          textColor="[#6C48E3]"
          className="text-[#6C48E3] w-full mt-8 py-3 font-semibold rounded-lg transition-all border border-[#6C48E3]
            bg-white hover:bg-[#6C48E3] hover:text-white focus:ring-2 focus:ring-[#6C48E3] focus:ring-offset-2"
          disabled={Object.keys(errors).length > 0}
        >
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <Link
          to="/users/login"
          className="font-semibold text-[#6C48E3] hover:text-[#5a3acf] transition-colors"
        >
          Sign In
        </Link>
      </p>
    </div>
  </div>
) : (
  <Authloader message="Creating your account..." fullScreen />
);
}

export default Signup;