
import { RefreshableArea } from './types';

export const DEFAULT_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export const formatTimeRemaining = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getInitialRefreshState = <T>(areas: RefreshableArea[], value: T): Record<RefreshableArea, T> => {
  return areas.reduce((acc, area) => {
    acc[area] = value;
    return acc;
  }, {} as Record<RefreshableArea, T>);
};

export const ALL_REFRESH_AREAS: RefreshableArea[] = ['dailyCare', 'dashboard', 'dogs', 'puppies', 'all'];
