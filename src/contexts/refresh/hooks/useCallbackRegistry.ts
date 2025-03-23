
import { useRef, useCallback } from 'react';
import { RefreshableArea, RefreshCallbacks } from '../types';

export function useCallbackRegistry(areas: RefreshableArea[]) {
  // Store refresh callbacks by area
  const callbacksRef = useRef<Record<RefreshableArea, RefreshCallbacks[]>>(
    areas.reduce((acc, area) => {
      acc[area] = [];
      return acc;
    }, {} as Record<RefreshableArea, RefreshCallbacks[]>)
  );
  
  // Register a component's refresh callback
  const registerCallback = useCallback((area: RefreshableArea, callbacks: RefreshCallbacks) => {
    callbacksRef.current[area].push(callbacks);
    
    // Return unregister function
    return () => {
      callbacksRef.current[area] = callbacksRef.current[area].filter(cb => cb !== callbacks);
    };
  }, []);
  
  // Trigger callbacks for specific area
  const triggerCallbacks = useCallback((areas: RefreshableArea[], date: Date, showToast: boolean) => {
    const refreshPromises: Promise<any>[] = [];
    
    areas.forEach(area => {
      callbacksRef.current[area].forEach(callbacks => {
        if (callbacks.onRefresh) {
          refreshPromises.push(callbacks.onRefresh(date, showToast));
        }
      });
    });
    
    return refreshPromises;
  }, []);
  
  // Notify about date change
  const notifyDateChange = useCallback((areas: RefreshableArea[], newDate: Date) => {
    areas.forEach(area => {
      callbacksRef.current[area].forEach(callbacks => {
        if (callbacks.onDateChange) {
          callbacks.onDateChange(newDate);
        }
      });
    });
  }, []);
  
  return {
    registerCallback,
    triggerCallbacks,
    notifyDateChange
  };
}
