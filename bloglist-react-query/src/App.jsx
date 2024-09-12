import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import Users from './components/Users';
import User from './components/User';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import LoginForm from './components/LoginForm';
import useLogin from './hooks/useLogin';
import useBlogOperations from './hooks/useBlogOperations';
import Navigation from './components/Navigation';

const RequireAuth = ({ children, user }) => {
  if (!user) {
    return <Navigate to='/' />;
  }
  return children;
};

const App = () => {
  const { user, credentials, handleChange, handleLogin, handleLogout } =
    useLogin();
  const {
    blogs,
    isLoading,
    isError,
    addBlogMutation,
    likeBlogMutation,
    deleteBlogMutation,
    blogFormRef,
  } = useBlogOperations(user);

  if (isLoading) return <div>Loading blogs...</div>;
  if (isError) return <div>Error fetching blogs</div>;

  const sortedBlogs = blogs ? [...blogs].sort((a, b) => b.likes - a.likes) : [];

  return (
    <Router>
      <Notification />
      <Navigation user={user} handleLogout={handleLogout} />
      <Routes>
        <Route
          path='/'
          element={
            !user ? (
              <LoginForm
                credentials={credentials}
                handleChange={handleChange}
                handleLogin={handleLogin}
              />
            ) : (
              <>
                <h2>blog app</h2>
                <Togglable buttonLabel='create new blog' ref={blogFormRef}>
                  <BlogForm createBlog={addBlogMutation.mutateAsync} />
                </Togglable>
                {sortedBlogs.map(blog => (
                  <Blog
                    key={blog.id}
                    blog={blog}
                    user={user}
                    likeBlog={likeBlogMutation.mutateAsync}
                    deleteBlog={deleteBlogMutation.mutateAsync}
                  />
                ))}
              </>
            )
          }
        />
        <Route
          path='/users'
          element={
            <RequireAuth user={user}>
              <Users />
            </RequireAuth>
          }
        />
        <Route
          path='/users/:id'
          element={
            <RequireAuth user={user}>
              <User />
            </RequireAuth>
          }
        />
        <Route
          path='/blogs/:id'
          element={
            <RequireAuth user={user}>
              <BlogDetail
                user={user}
                likeBlogMutation={likeBlogMutation}
                deleteBlogMutation={deleteBlogMutation}
              />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
