
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlurBackground from '@/components/ui/blur-background';
import Logo from '@/components/common/Logo';
import AuthForm from '@/components/auth/AuthForm';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useAuth } from '@/hooks/useAuth';

const Auth: React.FC = () => {
  const auth = useAuthForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  console.log('Auth page rendered, user state:', !!user);
  
  // If user is already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      console.log('Auth page: User already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-slate-50 dark:from-slate-900 dark:to-slate-900/80 px-4">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      
      <BlurBackground
        className="w-full max-w-md p-8 rounded-xl"
        intensity="lg"
        opacity="medium"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {auth.isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {auth.isLogin
              ? 'Enter your credentials to access your breeder dashboard'
              : 'Fill in your information to get started with Bear Paw Newfoundlands'}
          </p>
        </div>

        <AuthForm 
          email={auth.email}
          password={auth.password}
          isLogin={auth.isLogin}
          loading={auth.loading}
          showPassword={auth.showPassword}
          error={auth.error}
          onSubmit={auth.handleSubmit}
          onGoogleSignIn={auth.handleGoogleSignIn}
          onEmailChange={auth.handleEmailChange}
          onPasswordChange={auth.handlePasswordChange}
          onTogglePasswordVisibility={auth.togglePasswordVisibility}
          onToggleMode={auth.toggleMode}
        />
      </BlurBackground>
    </div>
  );
};

export default Auth;
