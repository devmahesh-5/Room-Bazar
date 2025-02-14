import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Home} from './components'
import {Signup} from './components'
import {Login} from './components'
import { Provider } from 'react-redux'
import {store} from './store/store.js'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<Home/>
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
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <RouterProvider router ={router} />
</Provider>
)
