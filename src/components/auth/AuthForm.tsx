
import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import ErrorMessage from './ErrorMessage';
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or continue with</span>
          </div>
        </div>

        <CustomButton
          type="button"
          variant="outline"
          fullWidth
          onClick={onGoogleSignIn}
          isLoading={loading}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
          Sign in with Google
        </CustomButton>
      </form>

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
