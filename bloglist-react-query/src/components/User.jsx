import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import userService from '../services/users';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from './LoadingSpinner';

const UserContainer = styled.div`
  padding: 20px;
`;

const UserName = styled.h2`
  font-size: 24px;
  color: #333;
  text-align: center;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  margin-top: 20px;
  color: #444;
`;

const BlogList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 10px 0;
`;

const BlogItem = styled.li`
  padding: 10px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const User = () => {
  const { id } = useParams();
  const { setNotification } = useNotification();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    onError: () => {
      setNotification('Error fetching user data', 'error');
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !user) {
    return <UserContainer>Error fetching user or user not found</UserContainer>;
  }

  return (
    <UserContainer>
      <UserName>{user.name}</UserName>
      {user.blogs.length > 0 ? (
        <SectionTitle>Added Blogs</SectionTitle>
      ) : (
        <SectionTitle>User has no blogs</SectionTitle>
      )}
      <BlogList>
        {user.blogs.map(blog => (
          <BlogItem key={blog.id}>{blog.title}</BlogItem>
        ))}
      </BlogList>
    </UserContainer>
  );
};

export default User;
