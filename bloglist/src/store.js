import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './reducers/notificationSlice';
import blogReducer from './reducers/blogSlice.js';
import userReducer from './reducers/userSlice.js';

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    user: userReducer,
    notification: notificationReducer,
  },
});

export default store;
