
/**
 * Puppies Module - Central location for puppy management functionality
 */

// Export all types
export * from './types';

// Export hooks
export * from './hooks/usePuppyTracking';

// Export mock data (only in development)
export * from './mockData/puppies';

// Export any components that might be needed
export { default as PuppyAgeGroupSection } from '@/components/dogs/components/care/puppies/PuppyAgeGroupSection';
export { default as PuppyCard } from '@/components/dogs/components/care/puppies/PuppyCard';
