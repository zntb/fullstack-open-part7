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

  const likeBlog = blog => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    likeBlogMutation.mutate({ id: blog.id, updatedBlog });
  };

  const deleteBlog = id => {
    const confirmRemove = window.confirm(
      'Are you sure you want to delete this blog?',
    );
    if (confirmRemove) {
      deleteBlogMutation.mutate(id);
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
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              likeBlog={likeBlog}
              deleteBlog={deleteBlog}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
