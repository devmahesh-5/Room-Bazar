import React, { useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import authService from "../services/auth.services.js";
import { Button, Authloader, Input, Logo } from "./index.js";
import { useLocation } from "react-router-dom";

function VerifyOTP() {
    const email = useParams().email
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(180);

    
    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const response = await authService.verifyOTP({ email, otp });
            if (response) {
                const userData = await authService.getCurrentUser();
                if (userData && userData.is_verified===true) {
                    navigate("/users/myprofile");
                }else{
                navigate("/users/login");
                }
            }
        } catch (error) {
            setError(error.response?.data?.error || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResendDisabled(true);
        setCountdown(180);
        
        // Start countdown
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setResendDisabled(false);
                    return 180;
                }
                return prev - 1;
            });
        }, 1000);

        try {
            await authService.resendOTP({ email });
        } catch (error) {
            setError("Failed to resend OTP");
        }
    };

    return !loading ? (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#F2F4F7]">
            <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-md">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>

                {error && <p className="text-red-600 mt-2 text-center">{error}</p>}

                <h2 className="text-center text-2xl font-bold leading-tight text-[#6C48E3]">
                    Verify Your Email
                </h2>

                <p className="mt-2 text-center text-base text-black/60">
                    We've sent a 6-digit code to {email}
                </p>

                <form onSubmit={handleVerify} className="mt-6">
                    <div className="space-y-5">
                        <div className="flex justify-center">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter OTP"
                                className="w-full max-w-xs p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C48E3] text-center text-xl tracking-widest"
                                maxLength={6}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full bg-[#6C48E3] hover:bg-[#5a3acf]">
                            Verify Account
                        </Button>

                        <div className="text-center text-sm text-black/60">
                            Didn't receive code?{" "}
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={resendDisabled}
                                className={`font-medium text-[#6C48E3] transition-all duration-200 ${resendDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
                            >
                                Resend OTP {resendDisabled && `(${countdown}s)`}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <Authloader message="Verifying..." fullScreen />
    );
}

export default VerifyOTP;