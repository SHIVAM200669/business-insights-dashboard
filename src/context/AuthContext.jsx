import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentSession, loginUser, registerUser, destroySession } from '../services/db';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hook to check session on startup
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const sessionUser = loginUser(email, password);
      setUser(sessionUser);
      return sessionUser;
    } catch (error) {
      throw error.message || 'Login failed.';
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const newUser = registerUser(name, email, password, role);
      // Automatically log in on registration for a seamless UX
      const sessionUser = loginUser(email, password);
      setUser(sessionUser);
      return newUser;
    } catch (error) {
      throw error.message || 'Registration failed.';
    }
  };

  const logout = () => {
    destroySession();
    setUser(null);
    window.location.href = '/login';
  };

  const updateProfileState = (updatedUser) => {
    setUser({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin',
    login,
    register,
    logout,
    updateProfileState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
