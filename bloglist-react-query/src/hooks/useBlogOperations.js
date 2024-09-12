import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import blogService from '../services/blogs';
import { useNotification } from '../context/NotificationContext';
import { useRef } from 'react';

const useBlogOperations = user => {
  const queryClient = useQueryClient();
  const { setNotification } = useNotification();
  const blogFormRef = useRef();

  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    enabled: !!user,
  });

  const addBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: newBlog => {
      queryClient.invalidateQueries(['blogs']);
      blogFormRef.current.toggleVisibility();
      setNotification(
        `A new blog "${newBlog.title}" by ${newBlog.author} added`,
        'success',
      );
    },
    onError: () => {
      setNotification('Error adding blog', 'error');
    },
  });

  const likeBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.update(id, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      setNotification('Blog liked successfully', 'success');
    },
    onError: () => {
      setNotification('Error liking blog', 'error');
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      setNotification('Blog deleted successfully', 'success');
    },
    onError: () => {
      setNotification('Error deleting blog', 'error');
    },
  });

  return {
    blogs,
    isLoading,
    isError,
    addBlogMutation,
    likeBlogMutation,
    deleteBlogMutation,
    blogFormRef,
  };
};

export default useBlogOperations;
