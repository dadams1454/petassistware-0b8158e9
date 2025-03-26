
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BlurBackground from '@/components/ui/blur-background';
import Logo from '@/components/common/Logo';
import AuthForm from '@/components/auth/AuthForm';
import { useAuthForm } from '@/hooks/useAuthForm';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuthForm();

  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    
    checkUser();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        if (session) {
          navigate('/dashboard');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-slate-50 dark:from-slate-900 dark:to-slate-900/80 px-4">
      <Link to="/" className="absolute top-8 left-8">
        <Logo />
      </Link>
      
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
              : 'Fill in your information to get started with BreedElite'}
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
