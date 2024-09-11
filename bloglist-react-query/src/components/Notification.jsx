import { useNotification } from '../context/NotificationContext';

const Notification = () => {
  const { notification } = useNotification();

  if (!notification.message) return null;

  const notificationStyle = {
    padding: '10px',
    color: notification.type === 'error' ? 'red' : 'green',
    backgroundColor: 'lightgrey',
    border: `2px solid ${notification.type === 'error' ? 'red' : 'green'}`,
    borderRadius: '5px',
    marginBottom: '10px',
  };
  return (
    <div data-testid='notification' style={notificationStyle}>
      {notification.message}
    </div>
  );
};

export default Notification;
