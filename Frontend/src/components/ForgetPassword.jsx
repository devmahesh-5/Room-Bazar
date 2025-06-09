import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import {Authloader, Button,Input,Logo} from './index.js'
import authService from '../services/auth.services.js'
function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const sendResetLink = async () => {
        try {
            setLoading(true);
            const response = await authService.sendForgetPasswordEmail({email});
            setSuccess(true);
        } catch (error) {
            setError(error.response?.data?.error);
        }finally{
            setLoading(false);
        }
    }

    if(success){
        return (
            <div className='flex items-center justify-center w-full'>
                   <div className={`mx-auto w-full max-w-lg bg-[var(--color-card)] rounded-xl p-10 border border-black/10`}>
                       <div className="mb-2 flex justify-center">
                           <span className="inline-block w-full max-w-[100px]">
                               <Logo width="100%" />
                           </span>
                           {error && (
                               <p className="text-red-500 text-xs mt-2">{error}</p>
                           )}
                       </div>
                       <div className="text-center">
                           <h3 className="text-2xl font-semibold text-gray-800">
                               Password Reset Link Sent
                           </h3>
                           <p className="text-gray-500 mt-2">
                               Check your email for the password reset link.
                           </p>
                       </div>
                   </div>
               </div>
        )
    }

    return !loading?(
       <div className='flex items-center justify-center w-full'
               >
                   <div className={`mx-auto w-full max-w-lg bg-[var(--color-card)] rounded-xl p-10 border border-black/10`}>
                       <div className="mb-2 flex justify-center">
                           <span className="inline-block w-full max-w-[100px]">
                               <Logo width="100%" />
                           </span>
                           {error && (
                               <p className="text-red-500 text-xs mt-2">{error}</p>
                           )}
                       </div>
                       <Input
                           label="Email"
                           type="email"
                           placeholder="Enter your email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                       />
                       <div className="mt-6">
                           <Button
                               type="submit"
                               className="w-full"
                               onClick={sendResetLink}
                               disabled={!email}
                           >
                               send reset link
                           </Button>
                       </div>
                       <div className="mt-6 flex justify-center">
                           <Link
                               to="/users/login"
                               className="text-sm text-gray-500 underline hover:text-gray-600"
                           >
                               Remember your password?
                           </Link>
                       </div>
                   </div>
               </div>
    ):(
        <Authloader message="Sending reset link..." />
    );
}

export default ForgetPassword
