import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import userService from '../services/users';
import { useNotification } from '../context/NotificationContext';

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
    return <div>Loading user data...</div>;
  }

  if (isError || !user) {
    return <div>Error fetching user or user not found</div>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
