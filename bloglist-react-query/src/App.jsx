import { useRef, useEffect, useState } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { useNotification } from './context/NotificationContext';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [user, setUser] = useState(null);
  const { setNotification } = useNotification();

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
      setNotification('Login successful', 'success');
    } catch (exception) {
      setNotification('Wrong username or password', 'error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem('loggedBlogappUser');
    setNotification('Logged out', 'success');
  };

  const addBlog = async blogObject => {
    try {
      const blog = await blogService.create(blogObject);
      setBlogs(blogs.concat(blog));
      blogFormRef.current.toggleVisibility();
      setNotification(
        `A new blog "${blog.title}" by ${blog.author} added`,
        'success',
      );
    } catch (exception) {
      setNotification('Error adding blog', 'error');
    }
  };

  const updateBlogLikes = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject);
      setBlogs(blogs.map(blog => (blog.id !== id ? blog : updatedBlog)));
    } catch (exception) {
      setNotification('Error updating likes', 'error');
    }
  };

  const removeBlog = async id => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
      setNotification('Blog removed successfully', 'success');
    } catch (exception) {
      setNotification('Error removing blog', 'error');
    }
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <Notification />
      {!user ? (
        <LoginForm
          credentials={credentials}
          handleChange={({ target }) =>
            setCredentials({ ...credentials, [target.name]: target.value })
          }
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
