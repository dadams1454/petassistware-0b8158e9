
import { useCallback, RefObject } from 'react';
import { RefreshableArea, RefreshCallbacks } from '../types';

/**
 * Hook for handling callback registration
 * Extracts the registration logic from the main callback registry
 */
export function useCallbackRegistration(
  callbacksRef: RefObject<Record<RefreshableArea, RefreshCallbacks[]>>
) {
  // Register a component's refresh callback
  const registerCallback = useCallback((area: RefreshableArea, callbacks: RefreshCallbacks) => {
    if (!callbacksRef.current) return () => {};
    
    callbacksRef.current[area].push(callbacks);
    
    // Return unregister function
    return () => {
      if (!callbacksRef.current) return;
      callbacksRef.current[area] = callbacksRef.current[area].filter(cb => cb !== callbacks);
    };
  }, [callbacksRef]);
  
  return { registerCallback };
}
