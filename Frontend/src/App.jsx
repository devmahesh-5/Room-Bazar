import { use, useEffect, useState, useCallback } from 'react'
import authService from './services/auth.services'
import './App.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authslice.js'
import { Outlet } from 'react-router-dom'
import { Header } from './components/index.js'
import { Footer } from './components/index.js'
import { Authloader } from './components/index.js'
import { useSelector } from 'react-redux'
import notificationService from './services/notification.services.js'
import { NotificationCard } from './components/index.js'
import messageService from './services/message.services.js'

function App() {
  const authStatus = useSelector((state) => state.auth.status);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const [notificationSection, setNotificationSection] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const notificationHandler = (otherNav=false) => {
    if (otherNav===true) {
      setNotificationSection(false);
    } else {
      setNotificationSection((prev) => !prev);
    }
  };

  const fetchNotifications = useCallback(async () => {
    try {
      if(!authStatus){
        setNotifications([]);
        return;
      }

      const notification = await notificationService.getMyNotifications();
        if (notification) {
          setNotifications(notification.data['notifications']);
          setUnreadNotifications(notification.data['unreadCount']);
        }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch notifications");
      setNotifications([]);
    }
  }, [authStatus]);


  const fetchUnreadMessages = useCallback(async () => {
    try {
      setError(null);
      const response = await messageService.getUnreadMessagesPerson();
      setUnreadMessages(response?.data[0]?.unreadCount);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch unread messages");
    }
  }, [authStatus]);


  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const user = await authService.getCurrentUser();

        if (user.data[0]) {
          dispatch(login({userData:user.data[0]}));
          setUser(user.data[0]);
          fetchNotifications();
          fetchUnreadMessages();
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setError(error.response?.data?.error || "Failed to fetch user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, fetchNotifications, fetchUnreadMessages]);



  return !loading? (
    <div className="min-h-screen flex flex-col relative bottom-0">
      <Header isNotification={notificationHandler} unreadMessages={unreadMessages} unreadNotifications={unreadNotifications} fetchNotifications={fetchNotifications}/>
      
      <main className="flex-grow bg-[var(--color-card)] relative">
        <Outlet />
        
        {/* Notification panel (fixed position overlapping content) */}
        {authStatus && notificationSection &&(
          <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-96 bg-[#F2F4F7] shadow-lg border-l border-gray-200 z-40 overflow-y-auto w-1/3">
            <div className="sticky top-0 bg-[#F2F4F7] p-4">
              <h2 className="text-lg font-semibold text-[#6C48E3]">Notifications</h2>
            </div>
            <div className="p-4">
              {notifications.length > 0 && !error ? (
                notifications.map((notification) => (
                  <NotificationCard
                    key={notification._id}
                    _id={notification._id}
                    message={notification.message}
                    isRead={notification.isRead}
                    timestamp={notification.createdAt}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {error && typeof error === 'string' ? (
                    <p>{error}</p>
                  ) : (
                    <p>No notifications found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
      
      <Footer />
    </div>
  ) : (
    <Authloader message="connecting your account..." fullScreen={true} />
  );
}

export default App;