import { createContext, useContext, useReducer, useRef } from 'react';

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return { message: action.payload.message, type: action.payload.type };
  case 'CLEAR_NOTIFICATION':
    return { message: '', type: '' };
  default:
    return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, {
    message: '',
    type: '',
  });
  const timeoutId = useRef(null);

  const setNotification = (message, type, duration = 5000) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: { message, type } });

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, duration);
  };

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
