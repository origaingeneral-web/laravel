import { createContext, useContext } from 'react';
import { usePage, router } from '@inertiajs/react';
import { AuthModel, UserModel } from '@/auth/lib/models';

export const AuthContext = createContext<any>({});

export function useAuth() {
  const { props } = usePage<any>();
  const user = props.auth?.user;

  const logout = () => {
    router.post('/logout');
  };

  return {
    loading: false,
    setLoading: () => {},
    auth: undefined,
    saveAuth: () => {},
    user,
    setUser: () => {},
    login: async () => {},
    register: async () => {},
    requestPasswordReset: async () => {},
    resetPassword: async () => {},
    resendVerificationEmail: async () => {},
    getUser: async () => user,
    updateProfile: async () => ({}) as UserModel,
    logout,
    verify: async () => {},
    isAdmin: user?.is_admin === true,
  };
}
