
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from "@radix-ui/react-slot";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  asChild?: boolean;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    isLoading = false,
    icon,
    iconPosition = 'left',
    asChild = false,
    children, 
    ...props 
  }, ref) => {
    // Base styles
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-60 disabled:pointer-events-none";
    
    // Variant styles
    const variantStyles = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/95",
      outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    };
    
    // Size styles
    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 h-8",
      md: "text-sm px-4 py-2 h-10",
      lg: "text-base px-6 py-3 h-12"
    };
    
    // Loading spinner
    const LoadingSpinner = () => (
      <svg 
        className="animate-spin -ml-1 mr-2 h-4 w-4" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          // Scale effect on hover for primary and secondary variants
          (variant === 'primary' || variant === 'secondary') && "hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        
        {!isLoading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        
        {children}
        
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </Comp>
    );
  }
);

CustomButton.displayName = 'CustomButton';

export { CustomButton };
