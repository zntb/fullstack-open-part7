import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from './services/blogs';
import loginService from './services/login';
import Blog from './components/Blog';
import Users from './components/Users';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import LoginForm from './components/LoginForm';
import { useNotification } from './context/NotificationContext';
import { useUser } from './context/UserContext';

const App = () => {
  const { user, loginUser, logoutUser } = useUser();
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

  const likeBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.update(id, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setNotification('Blog liked successfully', 'success');
    },
    onError: () => {
      setNotification('Error liking blog', 'error');
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: id => blogService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setNotification('Blog deleted successfully', 'success');
    },
    onError: () => {
      setNotification('Error deleting blog', 'error');
    },
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

  const addBlog = async blogObject => {
    try {
      await addBlogMutation.mutateAsync(blogObject);
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      blogFormRef.current.toggleVisibility();
      setNotification(
        `A new blog "${blogObject.title}" by ${blogObject.author} added`,
        'success',
      );
    } catch (error) {
      setNotification('Error adding blog', 'error');
    }
  };

  const likeBlog = async blog => {
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1 };
      await likeBlogMutation.mutateAsync({ id: blog.id, updatedBlog });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setNotification('Blog liked successfully', 'success');
    } catch (error) {
      setNotification('Error liking blog', 'error');
    }
  };

  const deleteBlog = async id => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlogMutation.mutateAsync(id);
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
        setNotification('Blog deleted successfully', 'success');
      } catch (error) {
        setNotification('Error deleting blog', 'error');
      }
    }
  };

  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  if (isError) {
    return <div>Error fetching blogs</div>;
  }

  const sortedBlogs = blogs ? [...blogs].sort((a, b) => b.likes - a.likes) : [];

  return (
    <Router>
      <Notification />
      <div>
        {!user ? (
          <LoginForm
            credentials={credentials}
            handleChange={handleChange}
            handleLogin={handleLogin}
          />
        ) : (
          <>
            <h2>blogs</h2>
            <div>
              {user.name} logged in{' '}
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <button onClick={handleLogout}>logout</button>
              </div>
            </div>
          </>
        )}
      </div>
      <Routes>
        <Route
          path='/'
          element={
            <>
              {user && (
                <Togglable buttonLabel='create new blog' ref={blogFormRef}>
                  <BlogForm createBlog={addBlog} />
                </Togglable>
              )}
              {sortedBlogs.map(blog => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  user={user}
                  likeBlog={likeBlog}
                  deleteBlog={deleteBlog}
                />
              ))}
            </>
          }
        />
        <Route path='/users' element={<Users />} />
      </Routes>
    </Router>
  );
};

export default App;
