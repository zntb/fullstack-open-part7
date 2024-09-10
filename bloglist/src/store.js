import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './reducers/notificationSlice';
import blogReducer from './reducers/blogSlice.js';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
  },
});

export default store;
