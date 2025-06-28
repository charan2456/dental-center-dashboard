import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadData, saveData } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = loadData();
      const foundUser = data.users.find(
        u => u.email === email && u.password === password
      );

      if (foundUser) {
        const userSession = {
          id: foundUser.id,
          email: foundUser.email,
          role: foundUser.role,
          name: foundUser.name,
          patientId: foundUser.patientId || null
        };
        
        setUser(userSession);
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        return { success: true, user: userSession };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = () => {
    return user && user.role === 'Admin';
  };

  const isPatient = () => {
    return user && user.role === 'Patient';
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isPatient,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

