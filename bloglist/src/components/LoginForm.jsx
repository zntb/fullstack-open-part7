const LoginForm = ({ credentials, handleChange, handleLogin }) => (
  <div>
    <h2>log in to application</h2>
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          data-testid='username'
          value={credentials.username}
          name='username'
          onChange={handleChange}
        />
      </div>
      <div>
        password
        <input
          type='password'
          data-testid='password'
          value={credentials.password}
          name='password'
          onChange={handleChange}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  </div>
);

export default LoginForm;
