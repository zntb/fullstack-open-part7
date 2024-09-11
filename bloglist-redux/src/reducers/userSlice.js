import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import loginService from '../services/login';
import blogService from '../services/blogs';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await loginService.login(credentials);
      blogService.setToken(user.token);
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  },
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      window.localStorage.removeItem('loggedBlogAppUser');
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
