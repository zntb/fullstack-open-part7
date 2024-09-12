import { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  margin: 10px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 30px;
`;

const Form = styled.form`
  width: 95%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  font-size: 16px;
  color: #555;
  margin-bottom: 5px;
`;

const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  }
`;

const Button = styled.button`
  margin-top: 30px;
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });

  const addBlog = event => {
    event.preventDefault();
    createBlog(newBlog);
    setNewBlog({ title: '', author: '', url: '' });
  };

  const handleBlogChange = ({ target }) => {
    setNewBlog({
      ...newBlog,
      [target.name]: target.value,
    });
  };

  return (
    <FormContainer>
      <Title>Create New Blog</Title>
      <Form onSubmit={addBlog}>
        <InputDiv>
          <Label htmlFor='title'>Title:</Label>
          <Input
            data-testid='title'
            type='text'
            id='title'
            value={newBlog.title}
            name='title'
            onChange={handleBlogChange}
          />
        </InputDiv>
        <InputDiv>
          <Label htmlFor='author'>Author:</Label>
          <Input
            data-testid='author'
            type='text'
            id='author'
            value={newBlog.author}
            name='author'
            onChange={handleBlogChange}
          />
        </InputDiv>
        <InputDiv>
          <Label htmlFor='url'>URL:</Label>
          <Input
            data-testid='url'
            type='text'
            id='url'
            value={newBlog.url}
            name='url'
            onChange={handleBlogChange}
          />
        </InputDiv>
        <Button type='submit'>Create</Button>
      </Form>
    </FormContainer>
  );
};

export default BlogForm;
