
import { useRef } from 'react';
import { RefreshableArea } from '../types';
import { useCallbackTriggers } from './useCallbackTriggers';
import { useCallbackRegistration } from './useCallbackRegistration';

export function useCallbackRegistry(areas: RefreshableArea[]) {
  // Store refresh callbacks by area
  const callbacksRef = useRef<Record<RefreshableArea, import('../types').RefreshCallbacks[]>>(
    areas.reduce((acc, area) => {
      acc[area] = [];
      return acc;
    }, {} as Record<RefreshableArea, import('../types').RefreshCallbacks[]>)
  );
  
  // Use more focused hooks for registration and triggering
  const { registerCallback } = useCallbackRegistration(callbacksRef);
  const { triggerCallbacks, notifyDateChange } = useCallbackTriggers(callbacksRef);
  
  return {
    registerCallback,
    triggerCallbacks,
    notifyDateChange
  };
}
