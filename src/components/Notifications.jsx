import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell,
  BellRing,
  Check,
  X,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Mail
} from 'lucide-react';

const Notifications = () => {
  const { data, updateData } = useData();
  const [notifications, setNotifications] = useState(data.notifications || []);

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    updateData({
      ...data,
      notifications: updatedNotifications
    });
  };

  const markAsUnread = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: false }
        : notification
    );
    setNotifications(updatedNotifications);
    updateData({
      ...data,
      notifications: updatedNotifications
    });
  };

  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    setNotifications(updatedNotifications);
    updateData({
      ...data,
      notifications: updatedNotifications
    });
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    updateData({
      ...data,
      notifications: updatedNotifications
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    updateData({
      ...data,
      notifications: []
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'Appointment Reminder':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'New Patient Registration':
        return <User className="h-5 w-5 text-green-500" />;
      case 'Treatment Completion':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Payment Due':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'System Alert':
        return <Bell className="h-5 w-5 text-red-500" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bell className="mr-3 h-8 w-8" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 mt-1">Stay updated with important alerts and reminders</p>
        </div>
        
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="flex items-center"
            >
              <Check className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="destructive"
              onClick={clearAllNotifications}
              className="flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500 text-center">
              You're all caught up! New notifications will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all duration-200 hover:shadow-md ${
                !notification.read 
                  ? 'border-l-4 border-l-blue-500 bg-blue-50/50' 
                  : 'border-l-4 border-l-transparent'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className={`text-sm ${
                        !notification.read 
                          ? 'text-gray-900 font-medium' 
                          : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-4">
                    {!notification.read ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 w-8 p-0"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsUnread(notification.id)}
                        className="h-8 w-8 p-0"
                        title="Mark as unread"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      title="Delete notification"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Notification Statistics */}
      {notifications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
              <p className="text-xs text-muted-foreground">
                All time notifications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <BellRing className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Read</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {notifications.length - unreadCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Already reviewed
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Notifications;

