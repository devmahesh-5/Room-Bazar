import React, { useState, useEffect } from 'react';
import notificationService from '../services/notification.services.js';
import { NotificationCard } from '../components/index.js';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const notification = await notificationService.getMyNotifications();
        if (notification) {
          setNotifications(notification.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading notifications...</div>;
  }

  if (!Array.isArray(notifications) || notifications.length === 0) {
    return (
      <div className="w-72 p-4 bg-[#F2F4F7] rounded-lg sticky top-0">
        <h2 className="text-lg font-semibold">No notifications</h2>
      </div>
    );
  }

  return (
    <div className="w-72 p-4 bg-[#F2F4F7] rounded-lg sticky top-0 h-screen overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification._id}
          _id={notification._id}
          message={notification.message}
          isRead={notification.isRead}
          timestamp={notification.createdAt}
        />
      ))}
    </div>
  );
}

export default Notifications;