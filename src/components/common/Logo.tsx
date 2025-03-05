
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'white';
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md',
  variant = 'primary' 
}) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const colors = {
    primary: 'text-primary font-medium',
    white: 'text-white font-medium',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'relative overflow-hidden rounded-md p-1.5',
        variant === 'primary' ? 'bg-primary text-white' : 'bg-white text-primary',
        {
          'h-7 w-7': size === 'sm',
          'h-8 w-8': size === 'md',
          'h-10 w-10': size === 'lg',
        }
      )}>
        <span className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 animate-pulse-gentle opacity-80"></span>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="relative z-10 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M17 14c1.66 0 3-1.34 3-3 0-1.31-1.16-2.94-3-5-1.84 2.06-3 3.69-3 5 0 1.66 1.34 3 3 3zm-9.34 7.41C7.43 20.41 4.69 18 2 18c0 4 3.47 6 8.66 6 4.47 0 7.77-1.23 9.62-4-2.22.24-6.2-.4-7.2-2 0 0-1.12.37-5.42-.59z" 
            fill="currentColor"
          />
          <path 
            d="M10.54 11.43c.95-1.3 2.07-3.29 2.2-5.43.26 0 .5 0 .72.05 1 .17 1.54.58 1.54.58 1.22 1.23 1.16 3.43.86 5.13-.67.22-1.17.24-1.8.4-.95.24-1.87.7-2.93 1.13-1.5.14-2.9-.66-3.13-2.05.47-.59 1.59-.8 2.54.19z" 
            fill="currentColor"
          />
        </svg>
      </div>
      <span className={cn(
        'font-semibold tracking-tight', 
        sizes[size], 
        colors[variant]
      )}>
        BreedElite
      </span>
    </div>
  );
};

export default Logo;
