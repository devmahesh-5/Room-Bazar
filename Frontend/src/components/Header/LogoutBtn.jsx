import React from 'react'
import { logout } from '../../store/authslice.js'
import { useDispatch } from 'react-redux'
import authService from '../../services/auth.services.js'
import { useNavigate } from 'react-router-dom'
import { MdMailOutline, MdFavorite, MdPerson, MdLogout} from "react-icons/md";
function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logoutHandler = () => {
        authService.logoutUser()
        .then((response)=>{
            dispatch(logout());
            navigate('/');
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    return (
        <button
        className='inline-bock px-6 py-2 duration-200 text-[#6C48E3] bg-[#F2F4F7] border border-[#6C48E3] rounded-lg hover:bg-[#6C48E3] hover:text-white'
        onClick={logoutHandler}
        >
            <MdLogout />
        </button>
    )
}

export default LogoutBtn
