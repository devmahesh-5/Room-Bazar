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
    const { register, handleSubmit,formState: { errors } } = useForm({ defaultValues: { username: generateUsername() } });
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
            const userSession = await authService.registerUser(formData);
            if (userSession) {
                setLoading(false);
                navigate(`/users/verify-otp/${userSession.data.email}`);
            }

        } catch (error) {
            setError(error.response?.data?.error || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return !loading ? (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#F2F4F7] p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-6 flex justify-center">
                    <span className="inline-block w-24">
                        <Logo width="100%" />
                    </span>
                </div>

                <h2 className="text-center text-3xl font-bold text-[#6C48E3] mb-2">
                    Create Your Account
                </h2>

                <p className="text-center text-gray-600 mb-8">
                    Join our community and start your journey
                </p>

                {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">{error}</div>}

                <form onSubmit={handleSubmit(signUp)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-5">
                            <Input
                                type="text"
                                label="Full Name"
                                placeholder="Ram Bahadur"
                                {...register("fullName", { required: true })}
                            />

                            <Input
                                type="email"
                                label="Email Address"
                                placeholder="rambhadur@gmail.com"
                                {...register("email", { required: true })}
                            />

                            <Input
                                type="text"
                                label="Username"
                                placeholder="ram_bahadur"
                                {...register("username", { required: true })}
                            />


<Input
    type="password"
    label="Password"
    placeholder="••••••••"
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

{errors.password && (
    <div className="mt-1 text-sm text-red-600">
        {errors.password.message}
    </div>
)}

<div className="mt-2 text-sm text-gray-600">
    <p>Password must contain:</p>
    <ul className="list-disc pl-5 space-y-1">
        <li>8-20 characters</li>
        <li>At least one letter</li>
        <li>At least one number</li>
    </ul>
</div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
                            <Input
                                type="text"
                                label="Address"
                                placeholder="City"
                                {...register("address", { required: true })}
                            />

                            <Input
                                type="number"
                                label="Phone Number"
                                placeholder="9800000000"
                                {...register("phone", { required: true })}
                            />

                            <Select
                                options={["Male", "Female", "Other"]}
                                label="Gender"
                                {...register("gender", { required: true })}
                                className="w-full"
                            />

                            <div className="space-y-4">
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
                                        {...register("avatar", { required: true })}
                                    />
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
                        className="w-full mt-8 py-3 text-lg font-semibold rounded-lg transition-all
                            bg-[#6C48E3] hover:bg-[#5a3acf] focus:ring-2 focus:ring-[#6C48E3] focus:ring-offset-2"
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
    )
}

export default Signup