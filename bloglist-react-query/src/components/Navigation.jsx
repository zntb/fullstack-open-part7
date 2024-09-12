import { Link } from 'react-router-dom';

const Navigation = ({ user, handleLogout }) => (
  <nav>
    <Link style={{ marginRight: 10 }} to='/'>
      Blogs
    </Link>
    <Link to='/users'>Users</Link>
    {user && (
      <span style={{ marginLeft: 10 }}>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </span>
    )}
  </nav>
);

export default Navigation;
