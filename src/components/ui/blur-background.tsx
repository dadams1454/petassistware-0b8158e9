
import React from 'react';
import { cn } from '@/lib/utils';

interface BlurBackgroundProps {
  className?: string;
  intensity?: 'sm' | 'md' | 'lg';
  opacity?: 'light' | 'medium' | 'heavy';
  color?: 'white' | 'dark' | 'primary' | 'transparent';
  children?: React.ReactNode;
}

const BlurBackground: React.FC<BlurBackgroundProps> = ({
  className,
  intensity = 'md',
  opacity = 'medium',
  color = 'white',
  children,
}) => {
  // Blur intensity classes
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-xl',
  };

  // Background opacity classes
  const opacityClasses = {
    light: {
      white: 'bg-white/30 dark:bg-slate-900/30',
      dark: 'bg-slate-900/30',
      primary: 'bg-primary/20',
      transparent: 'bg-transparent',
    },
    medium: {
      white: 'bg-white/60 dark:bg-slate-900/60',
      dark: 'bg-slate-900/60',
      primary: 'bg-primary/40',
      transparent: 'bg-transparent',
    },
    heavy: {
      white: 'bg-white/80 dark:bg-slate-900/80',
      dark: 'bg-slate-900/80',
      primary: 'bg-primary/60',
      transparent: 'bg-transparent',
    },
  };

  // Border classes
  const borderClasses = {
    white: 'border border-white/30 dark:border-white/10',
    dark: 'border border-white/10',
    primary: 'border border-primary/20',
    transparent: '',
  };

  return (
    <div
      className={cn(
        blurClasses[intensity],
        opacityClasses[opacity][color],
        borderClasses[color],
        'transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
};

export default BlurBackground;
