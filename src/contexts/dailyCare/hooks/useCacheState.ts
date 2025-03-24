
import { useCallback, useEffect, useRef } from 'react';
import { DogCareStatus } from '@/types/dailyCare';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

type CacheMap = Record<string, CacheEntry<DogCareStatus[]>>;

/**
 * Hook to manage cached state for dog care status
 * Uses localStorage for persistence between page loads
 */
export const useCacheState = () => {
  const cacheRef = useRef<CacheMap>({});
  const CACHE_KEY = 'dog_care_status_cache';
  const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes cache expiry
  
  // Load cache from localStorage on mount
  useEffect(() => {
    try {
      const storedCache = localStorage.getItem(CACHE_KEY);
      if (storedCache) {
        const parsedCache = JSON.parse(storedCache) as CacheMap;
        cacheRef.current = parsedCache;
        console.log('Loaded cache from localStorage:', Object.keys(parsedCache).length, 'entries');
      }
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
      // If there's an error, initialize with empty cache
      cacheRef.current = {};
    }
  }, []);
  
  // Save cache to localStorage
  const saveCache = useCallback(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheRef.current));
    } catch (error) {
      console.error('Error saving cache to localStorage:', error);
    }
  }, []);
  
  // Get cached status for a date
  const getCachedStatus = useCallback((dateKey: string): DogCareStatus[] | null => {
    const entry = cacheRef.current[dateKey];
    if (!entry) return null;
    
    // Check if cache is expired
    const now = Date.now();
    if (now - entry.timestamp > CACHE_EXPIRY) {
      // Remove expired entry
      delete cacheRef.current[dateKey];
      saveCache();
      return null;
    }
    
    return entry.data;
  }, [saveCache]);
  
  // Set cached status for a date
  const setCachedStatus = useCallback((dateKey: string, data: DogCareStatus[]) => {
    cacheRef.current[dateKey] = {
      data,
      timestamp: Date.now()
    };
    saveCache();
  }, [saveCache]);
  
  // Clear the entire cache
  const clearCache = useCallback(() => {
    cacheRef.current = {};
    localStorage.removeItem(CACHE_KEY);
  }, []);
  
  return {
    getCachedStatus,
    setCachedStatus,
    clearCache
  };
};
