import React,{ useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {Authloader} from './index.js'
export default function Protected({children,authentication}) {//it will check the authentication of the user for any route if not authenticated it will redirect to the login page
    const navigate=useNavigate()
    const authStatus=useSelector((state)=>state.auth.status)
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        if(authentication && authStatus!==authentication){//false && false = false     true && true = true
            navigate('/users/login');
        }else if(!authentication && authStatus!==authentication){ //true  && false=false   false && true = false
            navigate('/');
        }

        setLoading(false);
    },[authentication,authStatus,navigate])
    return loading?(<Authloader message='Loading...' fullScreen={false} inline={false} size='md' color='primary' />):(<>{children}</>)
}


