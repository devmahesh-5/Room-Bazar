import React from 'react'
import { Link } from 'react-router-dom'
function Logo({msg}) {
    return (
        <Link to="/" className='cursor-pointer flex flex-row items-center'>
        
        <img src="/logo_icon.png" alt="Room Bazar" srcSet="" className="w-12 h-12" />
        {msg && <h className='text-xs text-gray-600'>{msg}</h>}
        
        </Link>
    )
}

export default Logo
