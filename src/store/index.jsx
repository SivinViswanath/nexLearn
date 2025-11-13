import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mcqReducer from './slices/mcqSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mcq: mcqReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
