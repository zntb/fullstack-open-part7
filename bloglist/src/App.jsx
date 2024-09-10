import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const blogFormRef = useRef();

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
      const fetchBlogs = async () => {
        const fetchedBlogs = await blogService.getAll();
        setBlogs(fetchedBlogs);
      };
      fetchBlogs();
    }
  }, [user]);

  const handleLogin = async event => {
    event.preventDefault();
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setCredentials({ username: '', password: '' });
      setNotification({ message: 'Login successful', type: 'success' });
    } catch (exception) {
      setNotification({ message: 'Wrong username or password', type: 'error' });
    } finally {
      setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
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
    setNotification({ message: 'Logged out', type: 'success' });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 5000);
  };

  const addBlog = async blogObject => {
    try {
      const blog = await blogService.create(blogObject);
      setBlogs(blogs.concat(blog));
      blogFormRef.current.toggleVisibility();
      setNotification({
        message: `A new blog "${blog.title}" by ${blog.author} added`,
        type: 'success',
      });
    } catch (exception) {
      setNotification({ message: 'Error adding blog', type: 'error' });
    } finally {
      setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
    }
  };

  const updateBlogLikes = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject);
      setBlogs(blogs.map(blog => (blog.id !== id ? blog : updatedBlog)));
    } catch (exception) {
      setNotification({ message: 'Error updating likes', type: 'error' });
      setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
    }
  };

  const removeBlog = async id => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
      setNotification({
        message: 'Blog removed successfully',
        type: 'success',
      });
    } catch (exception) {
      setNotification({ message: 'Error removing blog', type: 'error' });
    } finally {
      setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
    }
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
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
          {sortedBlogs.map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlogLikes={updateBlogLikes}
              removeBlog={removeBlog}
              user={user}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
