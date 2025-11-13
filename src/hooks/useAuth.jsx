'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/slices/authSlice';
import { authApi } from '@/lib/api/authApi';

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      dispatch(logout());
      router.push('/login');
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    logout: handleLogout,
  };
}
