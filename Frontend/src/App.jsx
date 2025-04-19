import { useEffect, useState } from 'react'
import authService from './services/auth.services'
import './App.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authslice.js'
import { Outlet } from 'react-router-dom'
import {Header} from './components/index.js'
import {Footer} from './components/index.js'
import {Authloader} from './components/index.js'
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
      <main className="flex-grow flex flex-col bg-[#F2F4F7]">
          <Outlet />
      </main>
      <Footer />
    </div>
  ) : (
    <Authloader message='connecting your account...' fullScreen={true} />
  );
  
}

export default App
