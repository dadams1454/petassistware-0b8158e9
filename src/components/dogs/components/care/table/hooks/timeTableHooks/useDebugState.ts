
import { useState, useRef } from 'react';

export const useDebugState = () => {
  const [debugInfo, setDebugInfo] = useState<any>({ lastAction: 'init' });
  const clickCountRef = useRef<number>(0);
  const errorCountRef = useRef<number>(0);
  
  return { 
    debugInfo, 
    setDebugInfo, 
    clickCountRef, 
    errorCountRef 
  };
};
