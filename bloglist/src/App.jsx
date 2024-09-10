import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBlogs,
  createBlog,
  likeBlog,
  deleteBlog,
} from './reducers/blogSlice';
import { setNotificationWithTimeout } from './reducers/notificationSlice';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

const App = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();
  const dispatch = useDispatch();
  const blogs = useSelector(state => state.blogs.blogs);
  const status = useSelector(state => state.blogs.status);
  const error = useSelector(state => state.blogs.error);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchBlogs());
    }
  }, [user, dispatch]);

  const handleLogin = async event => {
    event.preventDefault();
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setCredentials({ username: '', password: '' });
      dispatch(
        setNotificationWithTimeout({
          message: 'Login successful',
          type: 'success',
        }),
      );
    } catch (exception) {
      dispatch(
        setNotificationWithTimeout({
          message: 'Wrong username or password',
          type: 'error',
        }),
      );
    }
  };

  const handleChange = ({ target }) => {
    setCredentials({
      ...credentials,
      [target.name]: target.value,
    });
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem('loggedBlogappUser');
    dispatch(
      setNotificationWithTimeout({ message: 'Logged out', type: 'success' }),
    );
  };

  const addBlog = async blogObject => {
    try {
      await dispatch(createBlog(blogObject)).unwrap();
      blogFormRef.current.toggleVisibility();
      dispatch(
        setNotificationWithTimeout({
          message: `A new blog "${blogObject.title}" by ${blogObject.author} added`,
          type: 'success',
        }),
      );
    } catch (error) {
      dispatch(
        setNotificationWithTimeout({
          message: 'Error adding blog',
          type: 'error',
        }),
      );
    }
  };

  const handleLike = async blog => {
    try {
      await dispatch(likeBlog(blog)).unwrap();
      dispatch(
        setNotificationWithTimeout({
          message: `Liked blog: "${blog.title}"`,
          type: 'success',
        }),
      );
    } catch (error) {
      dispatch(
        setNotificationWithTimeout({
          message: 'Error liking blog',
          type: 'error',
        }),
      );
    }
  };

  const handleDelete = async blog => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await dispatch(deleteBlog(blog.id)).unwrap();
        dispatch(
          setNotificationWithTimeout({
            message: `Deleted blog: "${blog.title}"`,
            type: 'success',
          }),
        );
      } catch (error) {
        dispatch(
          setNotificationWithTimeout({
            message: 'Error deleting blog',
            type: 'error',
          }),
        );
      }
    }
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <Notification />
      {!user ? (
        <LoginForm
          credentials={credentials}
          handleChange={handleChange}
          handleLogin={handleLogin}
        />
      ) : (
        <>
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {status === 'loading' && <p>Loading blogs...</p>}
          {status === 'failed' && <p>{error}</p>}
          {status === 'succeeded' &&
            sortedBlogs.map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                handleLike={() => handleLike(blog)}
                handleDelete={() => handleDelete(blog)}
              />
            ))}
        </>
      )}
    </div>
  );
};

export default App;
