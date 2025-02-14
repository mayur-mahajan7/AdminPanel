/* eslint-disable react/prop-types */
// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to provide authentication state
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login method to authenticate the user
  const login = () => {
    setIsAuthenticated(true);
  };

  // Logout method to unauthenticate the user
  const logout = () => {
    setIsAuthenticated(false);
  };

  // The context value should include both isAuthenticated and login/logout methods
  return <AuthContext.Provider value={{ isAuthenticated, login, logout ,setIsAuthenticated}}>{children}</AuthContext.Provider>;
};

// Custom hook to access authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
