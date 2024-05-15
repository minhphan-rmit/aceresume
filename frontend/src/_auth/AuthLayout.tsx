//import React from 'react'
import { Navigate } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    // Redirect them to the sign-in page, but save the current location they were trying to go to
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

export default AuthLayout
