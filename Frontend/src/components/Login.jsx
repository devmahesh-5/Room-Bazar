import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../services/auth.services.js'
import { useDispatch } from 'react-redux'
import { login as authLogin } from '../store/authslice.js'
import { useForm } from 'react-hook-form'
import { Button, Input, Logo, Authloader } from './index.js'
import axios from 'axios'
function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [passwordType, setPasswordType] = useState('password')

    const login = async (data) => {
        setLoading(true)
        setError(null)
        try {
            const userSession = await authService.loginUser(data);
            if (userSession) {
                const userData = await authService.getCurrentUser();

                if (userData) {
                    dispatch(authLogin({ userData }))
                }
                navigate('/rooms');
            }
        } catch (error) {
            setError(error.response.data.error)
        } finally {
            setLoading(false)
        }
    }
    return !loading ? (
        <div
            className='flex items-center justify-center w-full'
        >
            <div className={`mx-auto w-full max-w-lg bg-[var(--color-card)] rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight text-[#6C48E3]">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/users/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline text-[#6C48E3]"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && typeof error === 'string' && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(login)} className="mt-8">
                    <div className="space-y-4">
                        <Input
                            label="Email: "
                            type="email"
                            placeholder="Enter your email address"
                            {...register('email', {
                                required: true,
                                validate: {
                                    matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <div className="relative">
                            <Input
                                label="Password"
                                type={passwordType}
                                placeholder="Enter your password"
                                className="pr-10"  // Add padding for the toggle button
                                {...register('password', { required: true })}
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
                            <Link to="/users/forgetpassword" className="absolute left-3 top-[68px] text-[#6C48E3] hover:text-indigo-600 transition-colors focus:outline-none rounded-md ">Forgot Password?</Link><br />

                        </div>
                        <Button
                            type="submit"
                            className="w-full border hover:bg-[#F2F4F7] hover:text-[#6C48E3] hover:border-[#6C48E3]"
                        >Sign in</Button>

                        <Button
                            className="w-full mx-auto  flex items-center justify-center h-12 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#4285F4]/50"
                            onClick={()=>window.location.href='https://room-bazar.onrender.com/api/v1/users/auth/google'}
                        >


                            <div className="gsi-material-button-content-wrapper flex items-center gap-4">
                                <div className="gsi-material-button-icon w-6 h-6">
                                    <svg version="1.1" viewBox="0 0 48 48" className="w-full h-full">
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                    </svg>
                                </div>
                                <span className="gsi-material-button-contents text-sm font-medium text-gray-800">
                                    Continue with Google
                                </span>
                            </div>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <Authloader fullScreen={true} message='Connecting to server...' />
    )
}

export default Login
