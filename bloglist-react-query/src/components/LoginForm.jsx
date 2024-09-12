import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const FormTitle = styled.h2`
  font-size: 24px;
  color: #333;
`;

const FormField = styled.div`
  margin-bottom: 15px;
  width: 100%;
  max-width: 300px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoginForm = ({ credentials, handleChange, handleLogin }) => (
  <FormContainer>
    <FormTitle>Log in to Application</FormTitle>
    <form onSubmit={handleLogin}>
      <FormField>
        <label>Username</label>
        <Input
          type='text'
          value={credentials.username}
          name='username'
          onChange={handleChange}
        />
      </FormField>
      <FormField>
        <label>Password</label>
        <Input
          type='password'
          value={credentials.password}
          name='password'
          onChange={handleChange}
        />
      </FormField>
      <Button type='submit'>Login</Button>
    </form>
  </FormContainer>
);

export default LoginForm;
