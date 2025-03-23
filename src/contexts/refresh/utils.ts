
/**
 * Refresh Context Utilities
 * 
 * This file contains utility functions for the Refresh context system.
 * These functions help with managing refresh states, timing, and
 * formatting time for display throughout the application.
 */

import { RefreshableArea } from './types';

/**
 * Default refresh interval in milliseconds (15 minutes)
 * Used when no specific interval is provided
 */
export const DEFAULT_REFRESH_INTERVAL = 15 * 60 * 1000;

/**
 * Minimum refresh interval in milliseconds (1 minute)
 * Prevents setting refresh intervals that are too frequent
 */
export const MIN_REFRESH_INTERVAL = 60 * 1000;

/**
 * Maximum refresh interval in milliseconds (2 hours)
 * Prevents setting refresh intervals that are too infrequent
 */
export const MAX_REFRESH_INTERVAL = 2 * 60 * 60 * 1000;

/**
 * All available refresh areas in the application
 * Used for initialization and universal refresh operations
 */
export const ALL_REFRESH_AREAS: RefreshableArea[] = [
  'dailyCare',
  'dashboard', 
  'dogs', 
  'puppies', 
  'all'
];

/**
 * Formats a time duration in seconds into a readable MM:SS format
 * 
 * @param seconds - The number of seconds to format
 * @returns A string in the format "MM:SS" (e.g., "05:30" for 5 minutes and 30 seconds)
 */
export const formatTimeRemaining = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Creates an initial state object for all refresh areas
 * 
 * @param areas - Array of refresh areas to initialize
 * @param value - Default value to set for each area
 * @returns An object with each area as a key and the provided value
 */
export const getInitialRefreshState = <T>(areas: RefreshableArea[], value: T): Record<RefreshableArea, T> => {
  return areas.reduce((acc, area) => {
    acc[area] = value;
    return acc;
  }, {} as Record<RefreshableArea, T>);
};

/**
 * Validates a refresh interval is within acceptable limits
 * 
 * @param interval - The interval in milliseconds to validate
 * @returns The interval if valid, or the nearest limit if outside range
 */
export const validateRefreshInterval = (interval: number): number => {
  if (interval < MIN_REFRESH_INTERVAL) {
    console.warn(`Refresh interval ${interval}ms is too short, using minimum ${MIN_REFRESH_INTERVAL}ms`);
    return MIN_REFRESH_INTERVAL;
  }
  
  if (interval > MAX_REFRESH_INTERVAL) {
    console.warn(`Refresh interval ${interval}ms is too long, using maximum ${MAX_REFRESH_INTERVAL}ms`);
    return MAX_REFRESH_INTERVAL;
  }
  
  return interval;
};

/**
 * Converts milliseconds to a human-readable duration string
 * 
 * @param ms - Time in milliseconds
 * @returns Readable time string (e.g., "15 minutes" or "2 hours")
 */
export const formatDuration = (ms: number): string => {
  const seconds = ms / 1000;
  
  if (seconds < 60) {
    return `${Math.floor(seconds)} seconds`;
  }
  
  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${Math.floor(minutes)} ${Math.floor(minutes) === 1 ? 'minute' : 'minutes'}`;
  }
  
  const hours = minutes / 60;
  return `${Math.floor(hours)} ${Math.floor(hours) === 1 ? 'hour' : 'hours'}`;
};

/**
 * Calculates the next refresh time based on an interval
 * 
 * @param lastRefreshTime - When the last refresh occurred
 * @param interval - Refresh interval in milliseconds
 * @returns Date object representing when the next refresh should occur
 */
export const calculateNextRefreshTime = (lastRefreshTime: Date, interval: number): Date => {
  return new Date(lastRefreshTime.getTime() + interval);
};

/**
 * Determines if a specific area should be refreshed when refreshing a parent area
 * 
 * @param targetArea - The area being directly refreshed
 * @param checkArea - The area to check if it should be included
 * @returns Whether the checkArea should be refreshed
 */
export const shouldRefreshArea = (targetArea: RefreshableArea, checkArea: RefreshableArea): boolean => {
  if (targetArea === 'all') {
    return true;
  }
  
  return targetArea === checkArea;
};
