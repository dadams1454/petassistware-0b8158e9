
import { useState, useEffect } from 'react';
import { usePuppyStats } from './puppies/usePuppyStats';
import { PuppyManagementStats } from '@/types/puppyTracking';

export const usePuppyTracking = () => {
  // Use the existing stats hook
  const { stats, isLoading, error, refreshStats } = usePuppyStats();
  
  // Refresh function
  const refresh = async () => {
    await refreshStats();
  };
  
  return {
    stats,
    isLoading,
    error,
    refresh
  };
};
