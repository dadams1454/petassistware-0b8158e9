
import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import ErrorMessage from './ErrorMessage';
import GoogleSignInButton from './GoogleSignInButton';
import { AuthMode } from '@/hooks/useAuthForm';

interface AuthFormProps {
  email: string;
  password: string;
  isLogin: boolean;
  loading: boolean;
  showPassword: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePasswordVisibility: () => void;
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  email,
  password,
  isLogin,
  loading,
  showPassword,
  error,
  onSubmit,
  onGoogleSignIn,
  onEmailChange,
  onPasswordChange,
  onTogglePasswordVisibility,
  onToggleMode
}) => {
  return (
    <>
      {error && <ErrorMessage message={error} />}

      <form onSubmit={onSubmit} className="space-y-4">
        <EmailField email={email} onChange={onEmailChange} />
        <PasswordField 
          password={password}
          showPassword={showPassword}
          onChange={onPasswordChange}
          onToggleVisibility={onTogglePasswordVisibility}
        />

        <CustomButton
          type="submit"
          fullWidth
          isLoading={loading}
          icon={isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </CustomButton>
      </form>

      <GoogleSignInButton 
        onClick={onGoogleSignIn}
        isLoading={loading}
      />

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-primary hover:underline text-sm font-medium"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </>
  );
};

export default AuthForm;
