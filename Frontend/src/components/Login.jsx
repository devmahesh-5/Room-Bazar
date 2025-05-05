import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../services/auth.services.js'
import { useDispatch } from 'react-redux'
import { login as authLogin } from '../store/authslice.js'
import { useForm} from 'react-hook-form'
import { Button, Input, Logo,Authloader } from './index.js'
import { FaGoogle } from 'react-icons/fa'
function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    // const continueWithGoogle = async () => {
    //     setLoading(true)
    //     setError(null)
    //     try {
    //         const userSession = window.location.href = 'http://localhost:5000/api/v1/users/auth/google'
    //         if(userSession){
    //             const userData = await authService.getCurrentUser();
    //            if (userData) {
    //              dispatch(authLogin({userData}))
    //            }
    //            navigate('/rooms');
    //         } 
    //     } catch (error) {
    //         setError(error.response.data.error)
    //     }finally{
    //         setLoading(false)
    //     }
    // }
    const login = async (data) => {
        setLoading(true)
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
        }finally{
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
            className="w-full border hover:bg-[#F2F4F7] hover:text-[#6C48E3] hover:border-[#6C48E3]"
            >Sign in</Button>

<Button
  className="w-full mx-auto  flex items-center justify-center h-12 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#4285F4]/50"
  onClick={() => window.location.href = 'http://localhost:5000/api/v1/users/auth/google'}
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
    ):(
        <Authloader fullScreen={true} message='Connecting to server...'/>
    )
}

export default Login
