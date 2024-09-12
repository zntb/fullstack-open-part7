import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import userService from '../services/users';
import { useNotification } from '../context/NotificationContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const TableHeader = styled.th`
  padding: 12px;
  background-color: #f4f4f4;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(odd) {
    background-color: #fff;
  }

  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #ddd;
  }
`;

const TableData = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #007bff;

  &:hover {
    text-decoration: underline;
  }
`;

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
    return <LoadingSpinner />;
  }

  if (isError) {
    return <Container>Error fetching users</Container>;
  }

  return (
    <Container>
      <Title>Users</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Blogs Created</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableData>
                <StyledLink to={`/users/${user.id}`}>{user.name}</StyledLink>
              </TableData>
              <TableData>{user.blogs.length}</TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Users;
