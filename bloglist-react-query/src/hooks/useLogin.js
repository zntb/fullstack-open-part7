import { useState, useEffect } from 'react';
import loginService from '../services/login';
import blogService from '../services/blogs';
import { useNotification } from '../context/NotificationContext';
import { useUser } from '../context/UserContext';

const useLogin = () => {
  const { user, loginUser, logoutUser } = useUser();
  const { setNotification } = useNotification();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      loginUser(user);
      blogService.setToken(user.token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = event => {
    const { name, value } = event.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async event => {
    event.preventDefault();
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      loginUser(user);
      setCredentials({ username: '', password: '' });
      setNotification('Login successful', 'success');
    } catch (error) {
      setNotification('Wrong username or password', 'error');
    }
  };

  const handleLogout = () => {
    logoutUser();
    blogService.setToken(null);
    window.localStorage.removeItem('loggedBlogappUser');
    setNotification('Logged out', 'success');
  };

  return {
    user,
    credentials,
    handleChange,
    handleLogin,
    handleLogout,
  };
};

export default useLogin;
