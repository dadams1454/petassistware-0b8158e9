
import React from 'react';
import { CustomButton } from '@/components/ui/custom-button';

interface GoogleSignInButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick, isLoading }) => {
  return (
    <>
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
        onClick={onClick}
        isLoading={isLoading}
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
        Sign in with Google
      </CustomButton>
    </>
  );
};

export default GoogleSignInButton;
