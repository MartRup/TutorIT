import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // First check basic auth status
        const statusResponse = await fetch('http://localhost:8080/api/auth/status', {
          method: 'GET',
          credentials: 'include',
        });

        if (statusResponse.ok) {
          // Fetch current user data including role
          const userResponse = await fetch('http://localhost:8080/api/auth/current-user', {
            method: 'GET',
            credentials: 'include',
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            const role = userData.userType; // 'student' or 'tutor'

            // Store user data in localStorage for access across components
            localStorage.setItem('userType', role);
            localStorage.setItem('userEmail', userData.email);

            setUserRole(role);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Show loading state while checking auth status
  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Clear localStorage and redirect to login
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    return <Navigate to="/login" replace />;
  }

  // Check if route has role restrictions
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to dashboard if user doesn't have permission
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;