import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  margin: 0, auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  margin-bottom: 20px;
  padding: 10px;
`;

const StyledLink = styled(Link)`
  margin-right: 15px;
  text-decoration: none;
  color: #007bff;

  &:hover {
    text-decoration: underline;
  }
`;

const UserInfo = styled.span`
  margin-left: 10px;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const LogoutButton = styled.button`
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const Navigation = ({ user, handleLogout }) => (
  <Nav>
    <div>
      <StyledLink to='/'>Blogs</StyledLink>
      <StyledLink to='/users'>Users</StyledLink>
    </div>

    {user && (
      <UserInfo>
        {user.name} logged in{' '}
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </UserInfo>
    )}
  </Nav>
);

export default Navigation;
