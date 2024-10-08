import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const Notification = () => {
  const notification = useSelector(state => state.notification);

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

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
};

export default Notification;
