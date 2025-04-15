
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuthForm } from '@/hooks/useAuthForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const auth = useAuthForm();

  // Handle mode toggling for different auth screens
  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {mode === 'login' ? 'Welcome Back' : 
             mode === 'register' ? 'Create an Account' : 
             'Reset Password'}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'login' ? 'Enter your credentials to sign in' : 
             mode === 'register' ? 'Enter your details to create an account' : 
             'Enter your email to receive a reset link'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'login' || mode === 'register' ? (
            <AuthForm
              email={auth.email}
              password={auth.password}
              isLogin={mode === 'login'}
              loading={auth.loading}
              showPassword={auth.showPassword}
              error={auth.error}
              onSubmit={auth.handleSubmit}
              onGoogleSignIn={auth.handleGoogleSignIn}
              onEmailChange={auth.handleEmailChange}
              onPasswordChange={auth.handlePasswordChange}
              onTogglePasswordVisibility={auth.togglePasswordVisibility}
              onToggleMode={handleToggleMode}
            />
          ) : (
            <div>
              {/* Password reset form would go here */}
              <p>Password Reset form (not implemented in mock)</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
