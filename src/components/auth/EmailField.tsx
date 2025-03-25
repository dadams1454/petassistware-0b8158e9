
import React from 'react';
import { Mail } from 'lucide-react';

interface EmailFieldProps {
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailField: React.FC<EmailFieldProps> = ({ email, onChange }) => {
  return (
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Email
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Mail size={18} />
        </span>
        <input
          id="email"
          type="email"
          value={email}
          onChange={onChange}
          required
          className="w-full py-2 pl-10 pr-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-slate-800 dark:text-white"
          placeholder="your.email@example.com"
        />
      </div>
    </div>
  );
};

export default EmailField;
