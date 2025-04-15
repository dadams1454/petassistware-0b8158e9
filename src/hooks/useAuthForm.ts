
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export type AuthMode = 'login' | 'signup';

export const useAuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const toggleMode = () => setIsLogin(!isLogin);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        navigate('/dashboard');
      } else {
        // For the mock implementation, we'll simulate a signup
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
          title: "Account created!",
          description: "You can now sign in with your credentials.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during authentication');
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate Google sign-in with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Google Sign-In",
        description: "Google authentication is not implemented in this demo.",
      });
    } catch (error: any) {
      setError(error.message || 'An error occurred with Google sign-in');
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    isLogin,
    loading,
    showPassword,
    error,
    handleSubmit,
    handleGoogleSignIn,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    toggleMode
  };
};
