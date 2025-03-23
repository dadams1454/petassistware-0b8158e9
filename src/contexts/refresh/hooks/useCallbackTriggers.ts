
import { useCallback, RefObject } from 'react';
import { RefreshableArea, RefreshCallbacks } from '../types';

/**
 * Hook for managing callback triggers
 * Extracts the triggering logic from the main callback registry
 */
export function useCallbackTriggers(
  callbacksRef: RefObject<Record<RefreshableArea, RefreshCallbacks[]>>
) {
  // Trigger callbacks for specific area
  const triggerCallbacks = useCallback((areas: RefreshableArea[], date: Date, showToast: boolean) => {
    if (!callbacksRef.current) return [];
    
    const refreshPromises: Promise<any>[] = [];
    
    areas.forEach(area => {
      callbacksRef.current?.[area].forEach(callbacks => {
        if (callbacks.onRefresh) {
          refreshPromises.push(callbacks.onRefresh(date, showToast));
        }
      });
    });
    
    return refreshPromises;
  }, [callbacksRef]);
  
  // Notify about date change
  const notifyDateChange = useCallback((areas: RefreshableArea[], newDate: Date) => {
    if (!callbacksRef.current) return;
    
    areas.forEach(area => {
      callbacksRef.current?.[area].forEach(callbacks => {
        if (callbacks.onDateChange) {
          callbacks.onDateChange(newDate);
        }
      });
    });
  }, [callbacksRef]);
  
  return {
    triggerCallbacks,
    notifyDateChange
  };
}
