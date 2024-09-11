import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from './services/blogs';
import loginService from './services/login';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import LoginForm from './components/LoginForm';
import { useNotification } from './context/NotificationContext';

const App = () => {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const blogFormRef = useRef();
  const queryClient = useQueryClient();
  const { setNotification } = useNotification();

  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    enabled: !!user,
  });

  const addBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: newBlog => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      blogFormRef.current.toggleVisibility();
      setNotification(
        `A new blog "${newBlog.title}" by ${newBlog.author} added`,
        'success',
      );
    },
    onError: () => {
      setNotification('Error adding blog', 'error');
    },
  });

  const handleLogin = async event => {
    event.preventDefault();
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setCredentials({ username: '', password: '' });
      setNotification('Login successful', 'success');
    } catch (error) {
      setNotification('Wrong username or password', 'error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem('loggedBlogappUser');
    setNotification('Logged out', 'success');
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleChange = event => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const addBlog = blogObject => {
    addBlogMutation.mutate(blogObject);
  };

  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  if (isError) {
    return <div>Error fetching blogs</div>;
  }

  const sortedBlogs = blogs ? [...blogs].sort((a, b) => b.likes - a.likes) : [];

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
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {sortedBlogs.map(blog => (
            <Blog key={blog.id} blog={blog} user={user} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
