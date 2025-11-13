'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setCredentials } from '@/store/slices/authSlice';

export function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for tokens in cookies on mount
    const token = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (token) {
      // Restore auth state from cookies
      dispatch(
        setCredentials({
          token,
          refreshToken,
          user: null, // User data can be fetched if needed
        }),
      );
    }
  }, [dispatch]);

  return <>{children}</>;
}
