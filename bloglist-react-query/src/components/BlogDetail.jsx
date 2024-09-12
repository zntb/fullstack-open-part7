import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from '../services/blogs';

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
    return <div>Loading blog...</div>;
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
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      {user.username === blog.user.username && (
        <button onClick={handleDelete}>delete</button>
      )}

      <h3>Comments</h3>
      <ul>
        {(blog.comments || []).map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>

      <form onSubmit={handleAddComment}>
        <input
          type='text'
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder='Add a comment'
        />
        <button type='submit'>Add comment</button>
      </form>
    </div>
  );
};

export default BlogDetail;
