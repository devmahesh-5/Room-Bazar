import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Home} from './components'
import {Signup} from './components'
import {Login} from './components'
import Profiles from './pages/Profiles.jsx'
import { Provider } from 'react-redux'
import {store} from './store/store.js'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import Rooms from './pages/Rooms.jsx'
import Addroom from './pages/Addroom.jsx'
import Addroommate from './pages/Registerroommate.jsx'
import Room from './pages/Room.jsx'
import Notifications from './pages/Notifications.jsx'
import Message from './pages/Message.jsx'
const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<Login />
      },
      {
        path: '/users',
        children: [
          {
            path: 'signup',
            element: <Signup />
          },
          {
            path: 'login',
            element: <Login />
          }
        ]
      },
      {
        path:"/rooms",
        children:[
          {
            path:"",
            element:<Rooms />
          },
          {
            path:"add",
            element:<Addroom />
          },
          {
            path:':id',
            element:<Room />
          }
        ]
      },
      {
        path:'roommates',
        children:[
          {
            path:'',
            element:<Profiles />
          },
          {
            path:'add',
            element:<Addroommate />
          }
        ]

      },
      {
        path: 'notifications',
        element: <Notifications />
      },
      {
        path: 'messages/ib/:userId',
        children: [
          {
            path: '',
            element: <Message />
          }
        ]
      }

    ]
  }
])
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <RouterProvider router ={router} />
</Provider>
)
