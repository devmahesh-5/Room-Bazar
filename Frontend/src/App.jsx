import { useEffect, useState } from 'react'
import authService from './services/auth.services'
import './App.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authslice.js'
import { Outlet } from 'react-router-dom'
import {Header} from './components/index.js'
import {Footer} from './components/index.js'
function App() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(()=>{
    authService.getCurrentUser()
    .then((userData)=>{
      userData=userData.data[0]
       userData?dispatch(login({userData})):dispatch(logout());
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
      <main className="flex-grow bg-[#F2F4F7]">
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : null;
}

export default App
