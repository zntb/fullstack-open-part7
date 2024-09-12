import { useNotification } from '../context/NotificationContext';
import styled from 'styled-components';

const NotificationWrapper = styled.div`
  padding: 10px;
  color: ${({ type }) => (type === 'error' ? 'red' : 'green')};
  background-color: lightgrey;
  border: 2px solid ${({ type }) => (type === 'error' ? 'red' : 'green')};
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Notification = () => {
  const { notification } = useNotification();

  if (!notification.message) return null;

  return (
    <NotificationWrapper type={notification.type}>
      {notification.message}
    </NotificationWrapper>
  );
};

export default Notification;
