
import React, { useRef, useEffect } from 'react';

interface TouchHandlerProps {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onTouchMove: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
}

/**
 * Handles touch events for TimeSlotCell
 */
export const useTouchHandler = (onContextMenu?: (event: React.MouseEvent) => void) => {
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const isTouchActiveRef = useRef<boolean>(false);
  
  // Touch event handlers for quick click
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartTimeRef.current = Date.now();
    isTouchActiveRef.current = true;
  };
  
  const handleTouchEnd = () => {
    isTouchActiveRef.current = false;
  };
  
  const handleTouchMove = () => {
    isTouchActiveRef.current = false;
  };
  
  // Handle long press for mobile context menu alternative
  const handleTouchStart2 = (e: React.TouchEvent) => {
    if (onContextMenu) {
      touchTimeoutRef.current = setTimeout(() => {
        if (isTouchActiveRef.current) {
          // Long press detected, trigger context menu handler
          const touch = e.touches[0];
          const mouseEvent = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: touch.clientX,
            clientY: touch.clientY
          });
          
          onContextMenu(mouseEvent as unknown as React.MouseEvent);
        }
      }, 800); // 800ms long press
    }
    
    handleTouchStart(e);
  };
  
  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    handleTouchStart: handleTouchStart2,
    handleTouchEnd,
    handleTouchMove,
    touchTimeoutRef
  };
};
