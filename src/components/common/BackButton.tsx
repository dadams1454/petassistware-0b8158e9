
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface BackButtonProps {
  fallbackPath?: string;
  preserveQuery?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onBack?: () => void;
  label?: string;
}

/**
 * A reusable back button component that handles navigation history
 * and provides a consistent UI across the application.
 */
const BackButton: React.FC<BackButtonProps> = ({
  fallbackPath = '/dashboard',
  preserveQuery = false,
  variant = 'outline',
  size = 'default',
  className = '',
  onBack,
  label,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);

  // Check if we can use browser history to go back
  useEffect(() => {
    setCanGoBack(window.history.length > 2);
  }, []);

  const handleBack = () => {
    if (onBack) {
      // Use custom back handler if provided
      onBack();
    } else if (canGoBack) {
      // Use browser history
      navigate(-1);
    } else {
      // Use fallback path
      if (preserveQuery && location.search) {
        navigate(`${fallbackPath}${location.search}`);
      } else {
        navigate(fallbackPath);
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={`transition-all hover:translate-x-[-2px] ${className}`}
      aria-label="Go back"
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      {label || (size !== 'icon' ? 'Back' : '')}
    </Button>
  );
};

export default BackButton;
