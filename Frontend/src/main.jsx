import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Signup } from './components'
import { Login } from './components'
import Profiles from './pages/Profiles.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import Rooms from './pages/Rooms.jsx'
import Addroom from './pages/Addroom.jsx'
import Addroommate from './pages/Registerroommate.jsx'
import Room from './pages/Room.jsx'
import Message from './pages/Message.jsx'
import HollowMessage from './pages/HollowMessage.jsx'
import Favourites from './pages/Favourites.jsx'
import Myprofile from './pages/Myprofile.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'
import VerifyOtp from './pages/VerifyOtp.jsx'
import Payment from './pages/Payment.jsx'
import PaymentSuccess from './pages/PaymentSuccess.jsx'
import PaymentFailed from './pages/PaymentFailed.jsx'
import MyBooking from './pages/MyBooking.jsx'
import OAuthhandler from './pages/OAuthhandler.jsx'
import {Protected} from './components/index.js'
import TermsAndConditions from './pages/Termsandcondition.jsx'
import PrivacyPolicy from './pages/Privacy.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import FallBackPage from './pages/FallBackPage.jsx'
import Updateroom from './pages/Updateroom.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Khalti from './pages/afterpaymentKhalti.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <App />
        </ErrorBoundary>
    
  ),
    children: [
      {
        path: "/",
        element: (
          <Protected authentication>
            <Rooms />
          </Protected>
        )
      },
      {
        path: '/users',
        children: [
          {
            path: 'signup',
            element: (
              <Protected authentication={false}>
                <Signup />
              </Protected>
            )
          },
          {
            path: 'verify-otp/:email',
            element: (
              <Protected authentication={false}>
                <VerifyOtp />
              </Protected>
            )
          },
          {
            path: 'login',

            element: (
              <Protected authentication={false}>
                <Login />
              </Protected>
            )
          },
          {
            path: 'myprofile',
            element: (
              <Protected authentication={true}>
                <Myprofile />
              </Protected>
            )
          },
          {
            path: 'oauth-callback/:userId/:googleId',
            element: (
              <Protected authentication={false}>

                <OAuthhandler />
              </Protected>
            )
          },
          {
            path: 'my-bookings',
            element: (
              <Protected authentication>
                {" "}
                <MyBooking />
              </Protected>
            )
          },
          {
            path:'forgetpassword',
            element:(
              <Protected authentication={false}>
                <ForgetPassword />
              </Protected>
            )
          }

        ]
      },
      {
        path: "/rooms",
        children: [
          {
            path: "",
            element: (
              <Protected authentication>
                {" "}
                <Rooms />
              </Protected>
            )
          },
          {
            path: "add",
            element: (
              <Protected authentication>
                {" "}
                <Addroom />
              </Protected>
            )
          },
          {
            path: "update/:roomId",
            element: (
              <Protected authentication>
                {" "}
                <Updateroom />
              </Protected>
            )
          },
          {
            path: ':id',
            element: (
              <Protected authentication>
                {" "}
                <Room />
              </Protected>
            )
          },
          {
            path: 'payment/:roomId/:amount',
            element: (
              <Protected authentication>
                {" "}
                <Payment />
              </Protected>
            )
          }
        ]
      },
      {
        path: 'roommates',
        children: [
          {
            path: '',
            element: (
              <Protected authentication>
                {" "}
                <Profiles />
              </Protected>
            )
          },
          {
            path: 'add',
            element: (
              <Protected authentication>
                {" "}
                <Addroommate />
              </Protected>
            )
          },
          {
            path: ':roommateId',
            element: (
              <Protected authentication>
                {" "}
                <UserProfilePage />
              </Protected>
            )
          }
        ]

      },
      {
        path: 'messages/ib',
        children: [
          {
            path: '',
            element: (
              <Protected authentication>
                {" "}
                <HollowMessage />
              </Protected>
            )
          },
          {
            path: ':userId',
            element: (
              <Protected authentication>
                {" "}
                <Message />
              </Protected>
            )
          }
        ]
      },
      {
        path: 'favourites',
        children: [
          {
            path: 'myfavourites',
            element: (<Protected authentication>
              {" "}
              <Favourites />
            </Protected>
            )
          }
        ]
      },
      {
        path: 'payments',
        children: [
          {
            path: 'failed',
            element: (
              <Protected authentication>
                {" "}
                <PaymentFailed />
              </Protected>
            )

          },
          {
            path: 'success',
            element: (<Protected authentication>
              {" "}
              <PaymentSuccess />
            </Protected>
            )
          },
          {
            path: 'khalti/success/:paymentId',
            element: (<Protected authentication>
              {" "}
              <Khalti />
            </Protected>
            )
          }
        ]
      },
      {
        path: 'reset-password/:token',
        children: [
          {
            path: '',
            element: (
              <Protected authentication={false}>
                {" "}
                <ResetPassword />
              </Protected>
            )
          }
        ]
      }


    ]
  },
  {
    path: '/legal',
    children:[
      {
        path: 'terms-and-conditions',
        element: <TermsAndConditions />
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />
      }
    ]
  },
  {
    path: '*',
    element: <FallBackPage />
  }
  
])
createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  </ErrorBoundary>
)


