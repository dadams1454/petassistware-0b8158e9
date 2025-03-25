
import React from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  password: string;
  showPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisibility: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ 
  password, 
  showPassword, 
  onChange, 
  onToggleVisibility 
}) => {
  return (
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Password
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Lock size={18} />
        </span>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={onChange}
          required
          className="w-full py-2 pl-10 pr-10 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-slate-800 dark:text-white"
          placeholder="••••••••"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          onClick={onToggleVisibility}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
