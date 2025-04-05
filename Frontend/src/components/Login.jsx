import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../services/auth.services.js'
import { useDispatch } from 'react-redux'
import { login as authLogin } from '../store/authslice.js'
import { useForm} from 'react-hook-form'
import { Button, Input, Logo } from './index.js'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState(null)

    const login = async (data) => {
        setError(null)
        try {
            const userSession = await authService.loginUser(data);
            if(userSession){
                const userData = await authService.getCurrentUser();
               if (userData) {
                 dispatch(authLogin({userData}))
               }
               navigate('/rooms');
            } 
        } catch (error) {
            setError(error.response.data.error)
        }   
    }
    return (
        <div
        className='flex items-center justify-center w-full'
    >
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
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
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <form onSubmit={handleSubmit(login)} className="mt-8">
                <div className="space-y-4">
                    <Input 
                        label="Email: "
                        type="email"
                        placeholder="Enter your email address"
                        {...register('email',{
                            required:true,
                            validate: {
                                matchPattern:(value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                            }
                })}
                    />
                    <Input 
                        label="Password: "
                        type="password"
                        placeholder="Enter your password"
                        {...register('password',
                            {
                                required:true,

                            }
                        )}
                        />
                        <Button
            type="submit"
            className="w-full"
            >Sign in</Button>
                    </div>
            </form>
        </div>
    </div>   
    )
}

export default Login
