import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/status', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
        
        setIsLoggedIn(response.ok);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  // Show loading state while checking auth status
  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }
  
  if (!isLoggedIn) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;