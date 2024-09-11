import { useQuery } from '@tanstack/react-query';
import userService from '../services/users';
import { useNotification } from '../context/NotificationContext';

const Users = () => {
  const { setNotification } = useNotification();

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    onError: () => {
      setNotification('Error fetching users', 'error');
    },
  });

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (isError) {
    return <div>Error fetching users</div>;
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
