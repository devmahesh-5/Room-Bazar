import React from 'react'

function Logo({msg}) {
    return (
        <div className='cursor-pointer flex flex-row items-center'>
        <img src="/logo_icon.png" alt="Room Bazar" srcSet="" className="w-14 h-14" />
        {msg && <h className='text-xs text-gray-600'>{msg}</h>}
        </div>
    )
}

export default Logo
