import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
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
import LoadingSpinner from './components/LoadingSpinner';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #0093E9;
    background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
    background-repeat: repeat;
    background-size: 100% 100%;
    min-height: 100vh; 
    background-attachment: fixed;
    box-sizing: border-box;
  }
  h2, h3 {
    color: #333;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  text-align: center;
  text-transform: uppercase;
  color: #333;
  font-weight: bold;
  margin: 0;
  margin-bottom: 50px;
`;

const ToggleButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

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

  const [showAll, setShowAll] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error fetching blogs</div>;

  const sortedBlogs = blogs ? [...blogs].sort((a, b) => b.likes - a.likes) : [];

  const blogsToDisplay = showAll ? sortedBlogs : sortedBlogs.slice(0, 3);

  return (
    <>
      <GlobalStyle />
      <Router>
        <Container>
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
                    <Title>blog app</Title>
                    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
                      <BlogForm createBlog={addBlogMutation.mutateAsync} />
                    </Togglable>
                    {blogsToDisplay.map(blog => (
                      <Blog
                        key={blog.id}
                        blog={blog}
                        user={user}
                        likeBlog={likeBlogMutation.mutateAsync}
                        deleteBlog={deleteBlogMutation.mutateAsync}
                      />
                    ))}
                    {sortedBlogs.length > 4 && (
                      <ToggleButton onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Show Less' : 'Show More'}
                      </ToggleButton>
                    )}
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
        </Container>
      </Router>
    </>
  );
};

export default App;
