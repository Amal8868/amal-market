import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

import { AuthContext } from './auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount (relies on http-only cookie)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
      } catch {
        // Token might be expired or not present
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', { email, password });
      window.dispatchEvent(new Event('auth_change')); // Reset previous user's cart/wishlist
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Welcome back!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (name, email, password, phone, address) => {
    try {
      setLoading(true);
      window.dispatchEvent(new Event('auth_change')); // Start with empty cart/wishlist for new account
      const { data } = await api.post('/auth/register', { name, email, password, phone, address });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Account created successfully!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed on server', err);
    }
    window.dispatchEvent(new Event('auth_change')); // Clear cart/wishlist on logout
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out');
  };

  // Update User Details
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
