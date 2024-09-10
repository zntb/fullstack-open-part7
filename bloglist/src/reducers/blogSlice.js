import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
  const blogs = await blogService.getAll();
  return blogs;
});

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

export const likeBlog = createAsyncThunk('blogs/likeBlog', async blog => {
  const updatedBlog = await blogService.update(blog.id, {
    ...blog,
    likes: blog.likes + 1,
  });
  return updatedBlog;
});

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (id, { rejectWithValue }) => {
    try {
      await blogService.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

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

      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })

      .addCase(likeBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(
          blog => blog.id === action.payload.id,
        );
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })

      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
      });
  },
});

export default blogSlice.reducer;
