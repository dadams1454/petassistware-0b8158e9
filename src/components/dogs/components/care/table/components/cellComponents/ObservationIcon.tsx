
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ObservationIconProps {
  hasObservation: boolean;
  onClick: (e: React.MouseEvent) => void;
  position?: 'desktop' | 'mobile';
}

const ObservationIcon: React.FC<ObservationIconProps> = ({
  hasObservation,
  onClick,
  position = 'desktop'
}) => {
  const isDesktop = position === 'desktop';
  
  return (
    <div 
      className={`
        ${isDesktop 
          ? `absolute top-0 right-0 opacity-0 hover:opacity-100 transition-opacity p-0.5 ${hasObservation ? 'opacity-70' : ''}` 
          : `absolute top-1 right-1 ${hasObservation ? 'opacity-90' : 'opacity-40'} touch-manipulation`
        }
      `}
      onClick={onClick}
    >
      <MessageCircle 
        className={`
          ${isDesktop 
            ? `h-3 w-3 ${hasObservation ? 'text-amber-600 dark:text-amber-400 fill-amber-100 dark:fill-amber-900/30' : 'text-gray-400 dark:text-gray-600'}` 
            : `h-4 w-4 ${hasObservation ? 'text-amber-600 dark:text-amber-400 fill-amber-100 dark:fill-amber-900/30' : 'text-gray-500 dark:text-gray-500'}`
          }
        `}
        aria-label="Add or view observation"
      />
    </div>
  );
};

export default ObservationIcon;
