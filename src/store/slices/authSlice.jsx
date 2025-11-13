import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;

      // Store tokens in cookies
      if (token) {
        Cookies.set('accessToken', token, { expires: 1 }); // 1 day
      }
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 days
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear cookies
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    },
    updateToken: (state, action) => {
      state.token = action.payload;
      Cookies.set('accessToken', action.payload, { expires: 1 });
    },
  },
});

export const { setCredentials, setLoading, setError, logout, updateToken } =
  authSlice.actions;
export default authSlice.reducer;
