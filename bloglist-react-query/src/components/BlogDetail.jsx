import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import blogService from '../services/blogs';
import LoadingSpinner from './LoadingSpinner';

const BlogDetailContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const BlogLikes = styled.div`
  margin: 10px 0 10px 0;
`;

const BlogAuthor = styled.div`
  margin: 10px 0 10px 0;
`;

const CommentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CommentInput = styled.input`
  width: 98%;
  margin: 10px auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;

  &:focus {
    outline: none;
    border: 1px solid #007bff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: #ccc;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    margin: 10px 0 10px -6px;
  }
`;

const CommentItem = styled.li`
  padding: 5px;
  border-bottom: 1px solid #ddd;
`;

const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 12px;
  margin: 0 10px 0 10px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;

const BlogDetail = ({ user, likeBlogMutation, deleteBlogMutation }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getBlogById(id),
  });

  const addCommentMutation = useMutation({
    mutationFn: newComment => blogService.addComment(id, newComment),
    onSuccess: updatedBlog => {
      queryClient.setQueryData(['blog', id], old => ({
        ...old,
        comments: updatedBlog.comments,
      }));
    },
    onError: error => {
      console.error('Error adding comment:', error);
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !blog) {
    return <div>Error fetching blog or blog not found.</div>;
  }

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };

    queryClient.setQueryData(['blog', id], old => ({
      ...old,
      likes: old.likes + 1,
    }));

    try {
      await likeBlogMutation.mutateAsync({ id: blog.id, updatedBlog });
    } catch (error) {
      queryClient.setQueryData(['blog', id], old => old);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await deleteBlogMutation.mutateAsync(blog.id);
      navigate('/');
    }
  };

  const handleAddComment = async event => {
    event.preventDefault();
    if (comment.trim()) {
      try {
        await addCommentMutation.mutateAsync(comment);
        setComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  return (
    <BlogDetailContainer>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <BlogLikes>
        {blog.likes} likes{' '}
        <ActionButton onClick={handleLike}>like</ActionButton>
      </BlogLikes>
      <BlogAuthor>added by {blog.user.name}</BlogAuthor>
      {user.username === blog.user.username && (
        <ActionButton onClick={handleDelete}>delete</ActionButton>
      )}

      <h3>Comments</h3>
      <CommentList>
        {(blog.comments || []).map((comment, index) => (
          <CommentItem key={index}>{comment}</CommentItem>
        ))}
      </CommentList>

      <form onSubmit={handleAddComment}>
        <CommentInput
          type='text'
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder='Write a comment...'
        />
        <ActionButton type='submit'>Add comment</ActionButton>
      </form>
    </BlogDetailContainer>
  );
};

export default BlogDetail;
