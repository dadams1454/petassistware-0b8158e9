
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Auth = () => {
  const location = useLocation();
  const [authMode, setAuthMode] = useState(() => {
    if (location.pathname === '/login') return 'login';
    if (location.pathname === '/register') return 'register';
    if (location.pathname === '/forgot-password') return 'forgot';
    if (location.pathname === '/reset-password') return 'reset';
    return 'login'; // Default to login
  });

  // Render the appropriate form based on the path
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {authMode === 'login' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
            <p className="text-center text-gray-500 mb-8">Please sign in to your account</p>
            {/* Login form placeholder */}
          </div>
        )}
        
        {authMode === 'register' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
            <p className="text-center text-gray-500 mb-8">Register to get started</p>
            {/* Register form placeholder */}
          </div>
        )}
        
        {authMode === 'forgot' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
            <p className="text-center text-gray-500 mb-8">We'll send you a reset link</p>
            {/* Forgot password form placeholder */}
          </div>
        )}
        
        {authMode === 'reset' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">New Password</h2>
            <p className="text-center text-gray-500 mb-8">Enter your new password</p>
            {/* Reset password form placeholder */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
