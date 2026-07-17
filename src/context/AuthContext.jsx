import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser, updateProfile } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        if (res.success && res.data) {
          setUser(res.data);
          setIsAuthenticated(true);
        }
      } catch {
        // Not authenticated — silently continue
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await loginUser(credentials);
    if (res.success && res.data) {
      const { user: userData, accessToken } = res.data;
      setUser(userData);
      setIsAuthenticated(true);
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      toast.success(res.message || 'Logged in successfully');
    }
    return res;
  }, []);

  const register = useCallback(async (formData) => {
    const res = await registerUser(formData);
    if (res.success) {
      toast.success(res.message || 'Registration successful! Please log in.');
    }
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Even if server logout fails, clear local state
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      toast.success('Logged out successfully');
    }
  }, []);

  const updateUser = useCallback(async (data) => {
    const res = await updateProfile(data);
    if (res.success && res.data) {
      setUser(res.data);
      toast.success(res.message || 'Profile updated successfully');
    }
    return res;
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to consume the AuthContext.
 * Must be used within an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
