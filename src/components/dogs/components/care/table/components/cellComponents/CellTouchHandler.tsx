
import React, { useRef } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface CellTouchHandlerProps {
  children: React.ReactNode;
  popoverOpen: boolean;
  setPopoverOpen: (open: boolean) => void;
  onLongPress: () => void;
}

const CellTouchHandler: React.FC<CellTouchHandlerProps> = ({
  children,
  popoverOpen,
  setPopoverOpen,
  onLongPress
}) => {
  // Refs for touch handling
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const isTouchActiveRef = useRef<boolean>(false);
  
  // Touch event handlers for long press
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartTimeRef.current = Date.now();
    isTouchActiveRef.current = true;
    
    // Set a timeout for long press (700ms is a good balance)
    touchTimeoutRef.current = setTimeout(() => {
      if (isTouchActiveRef.current) {
        // Prevent the regular click from firing
        e.preventDefault();
        onLongPress();
        
        // Provide haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 700);
  };
  
  const handleTouchEnd = () => {
    // Clear the timeout and reset the touch state
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    isTouchActiveRef.current = false;
  };
  
  const handleTouchMove = () => {
    // If the user moves their finger, cancel the long press
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    isTouchActiveRef.current = false;
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          className="w-full h-full"
        >
          {children}
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-auto p-2 text-xs" side="top">
        <p>Tap to log care, tap and hold for observations</p>
      </PopoverContent>
    </Popover>
  );
};

export default CellTouchHandler;
