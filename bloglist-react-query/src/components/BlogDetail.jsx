import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import blogService from '../services/blogs';

const BlogDetail = ({ user, likeBlogMutation, deleteBlogMutation }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getBlogById(id),
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
    </div>
  );
};

export default BlogDetail;
