// src/components/AuthGuard/AuthGuard.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import PropTypes from 'prop-types'; // Assuming you have an AuthContext

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Use your authentication logic here
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.any.isRequired
};

export default AuthGuard;
