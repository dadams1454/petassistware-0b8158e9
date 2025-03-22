
import { useState, useRef } from 'react';

/**
 * Hook to manage debug tracking for the time table
 */
export const useDebugState = () => {
  const clickCountRef = useRef<number>(0);
  const errorCountRef = useRef<number>(0);
  const [debugInfo, setDebugInfo] = useState<string>('');

  return {
    clickCountRef,
    errorCountRef,
    debugInfo,
    setDebugInfo
  };
};
