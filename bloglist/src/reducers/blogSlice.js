import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

// Async thunk to fetch all blogs
export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
  const blogs = await blogService.getAll();
  return blogs;
});

// Async thunk to create a new blog
export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async (newBlog, { rejectWithValue }) => {
    try {
      const createdBlog = await blogService.create(newBlog);
      return createdBlog;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create blog
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      });
  },
});

export default blogSlice.reducer;
