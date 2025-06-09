import React, { useState } from "react";
import authService from "../services/auth.services";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Authloader, Input } from "./index.js";
import { useForm } from "react-hook-form";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm({ mode: "onBlur" });

    const resetPassword = async (data) => {
        setLoading(true);
        try {
            await authService.resetPassword(token, data?.password);
            navigate("/users/login");
        } catch (error) {
            setError(error.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    return !loading && !error ? (
        <div
            className='flex items-center justify-center w-full'
        >
            <div className={`mx-auto w-full max-w-lg bg-[var(--color-card)] rounded-xl p-10 border border-black/10`}>
                <h2 className="text-2xl font-bold mb-4 text-[#6C48E3] text-center">Reset Password</h2>
                <form onSubmit={handleSubmit(resetPassword)}>
                    <div className="relative mb-4">
                        <Input
                            type="password"
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

                        <Input
                            type="password"
                            label="Confirm Password"
                            placeholder="••••••••"
                            className="pr-10"
                            {...register("confirmPassword", {
                                required: "Confirm Password is required",
                                validate: (value) => value === watch("password") || "Passwords do not match"
                            })}
                            error={errors.confirmPassword?.message}
                        />

                    </div>
                    <Button type="submit"
                        disabled={loading}
                        className={`w-full mt-4 items-center ${(watch("password") !== watch("confirmPassword")) || watch("password") === "" ? "opacity-50 cursor-not-allowed" : ""}`}


                    >
                        {loading ? <Authloader /> : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    ) : loading && !error ? (
        <div className="auth-form-container">
            {loading && <Authloader />}
            {error && <p className="error">{error}</p>}
        </div>
    ) : (
        <div className="auth-form-container">
  {error && (
    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
      <div className="flex items-center">
        <svg 
          className="w-5 h-5 text-red-500 mr-3" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
            clipRule="evenodd" 
          />
        </svg>
        <h3 className="text-red-800 font-medium">Error</h3>
      </div>
      <p className="mt-2 text-sm text-red-700">{error}</p>
    </div>
  )}
</div>
    );
};

export default ResetPassword;