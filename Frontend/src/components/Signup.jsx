import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.services.js";
import { useDispatch } from "react-redux";
import { Button, Input, Logo, Select } from "./index.js";
import { useForm } from "react-hook-form";
import { login } from "../store/authslice.js";

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState(null);

    const signUp = async (data) => {
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
                const loginUser = await authService.loginUser(data);
                if (loginUser) {
                    const userData = await authService.getCurrentUser();
                    if (userData) {
                        dispatch(login({ userData }));
                    }
                    navigate("/");
                }
            }
        } catch (error) {
            setError(error.response.data.error || "Signup failed");
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#F2F4F7]">
            <div className="w-full max-w-3xl p-10 bg-[#F2F4F7]">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>

                {error && <p className="text-red-600 mt-2 text-center">{error}</p>}

                <h2 className="text-center text-2xl font-bold leading-tight text-[#6C48E3]">
                    Sign up to create an account
                </h2>

                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?{" "}
                    <Link
                        to="/users/login"
                        className="font-medium text-[#6C48E3] transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>

                <form onSubmit={handleSubmit(signUp)} className="mt-6">
                    <div className="space-y-5">
                        <Input type="text" label="Full Name" placeholder="Name" {...register("fullName", { required: true })} />
                        <Input
                            type="email"
                            label="Email"
                            placeholder="Enter your email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Invalid email address",
                                },
                            })}
                        />
                        <Input
                            type="text"
                            label="Username"
                            placeholder="Username"
                            {...register("username", {
                                required: "Username is required", // Add a custom error message for required
                                minLength: { value: 6, message: "Username must be at least 6 characters" },
                                maxLength: { value: 20, message: "Username must be at most 20 characters" },
                                pattern: {
                                    value: /^[a-z0-9_]{6,20}$/,
                                    message: "Username must contain only lowercase letters, numbers, and underscores"
                                },
                            })}
                        />


                        <Input
                            type="password"
                            label="Password"
                            placeholder="Password"
                            {...register("password", {
                                required: true,
                                minLength: { value: 6, message: "Password must be at least 6 characters" },
                                maxLength: { value: 20, message: "Password must be at most 20 characters" },
                            })}
                        />
                        <Input type="text" label="Address" placeholder="Address" {...register("address", { required: true })} />
                        <Input
                            type="number"
                            label="Phone"
                            placeholder="Phone"
                            {...register("phone", {
                                required: "Phone number is required",
                                minLength: { value: 10, message: "Phone number must be 10 digits" },
                                maxLength: { value: 10, message: "Phone number must be 10 digits" },
                                pattern: { value: /^[0-9]{10}$/, message: "Phone number must contain only digits" },
                            })}
                        />
                        <Select
                            options={["Male", "Female", "Other"]}
                            label="Gender"
                            {...register("gender", { required: "Gender is required" })}
                        />
                        <Input type="file" label="Profile Picture" {...register("avatar", { required: true })} />
                        <Input type="file" label="Cover Image" {...register("coverImage", { required: true })} />

                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
