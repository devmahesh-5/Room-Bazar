import React from 'react'
import { logout } from '../../store/authslice.js'
import { useDispatch } from 'react-redux'
import authService from '../../services/auth.services.js'
import { useNavigate } from 'react-router-dom'
import { MdMailOutline, MdFavorite, MdPerson, MdLogout} from "react-icons/md";
import {Authloader} from '../index.js'
function LogoutBtn({clearNav}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const logoutHandler = async() => {
        setLoading(true);
        try {
            await authService.logout();
            dispatch(logout());
            clearNav();
            navigate('/users/login');
        } catch (error) {
            setError(error.response.data.error);
        }finally{
            setLoading(false);
        }
    }
    return !loading && !error?(

        <button
        className='inline-bock px-6 py-2 duration-200 text-[#6C48E3] bg-[#F2F4F7] border border-[#6C48E3] rounded-lg hover:bg-[#6C48E3] hover:text-white flex items-center gap-2 w-full justify-center'
        onClick={logoutHandler}
        >
            <MdLogout />
            Logout
        </button>
    ):!loading && error?(
        <p className='text-red-500'>{error}</p>
    ):(
        <Authloader message='Logging out...' fullScreen />
    )
}

export default LogoutBtn
