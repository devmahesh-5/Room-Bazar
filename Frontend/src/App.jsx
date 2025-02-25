import { useEffect, useState } from 'react'
import authService from './services/auth.services'
import './App.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authslice.js'
import { Outlet } from 'react-router-dom'
import {Header} from './components/index.js'
import {Footer} from './components/index.js'
import {MessageProfile} from './components/index.js'
import { useSelector } from 'react-redux'

function App() {
  const authStatus = useSelector((state) => state.auth.status);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(()=>{
    authService.getCurrentUser()
    .then((userData)=>{
      userData=userData.data[0]
      if(userData){
         dispatch(login({userData}))
      }else{
        dispatch(logout())
      }
    })
    .catch((error)=>{
        setError(error)
    })
    .finally(()=>{
        setLoading(false)
    })
  },[])
  return !loading ? (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-[#F2F4F7] flex flex-row-reverse"> {/* Added `flex-row-reverse` */}
        {/* Sidebar (MessageProfile) - Moves to Right */}
       {authStatus && <MessageProfile className="ml-4 w-1/3" /> 
       } {/* Use `ml-4` for spacing from Outlet */}
  
        {/* Main Content (Outlet) - Takes Remaining Space */}
        <div className="flex-grow">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  ) : (
    <div>Loading...</div>
  );
  
}

export default App
