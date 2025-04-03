
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Male, Female, HelpCircle } from 'lucide-react';

/**
 * Format a date string for display
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Not recorded';
  
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Render an appropriate icon for the puppy's gender
 */
export const renderGenderIcon = (gender: string | null) => {
  if (!gender) return <HelpCircle className="h-3.5 w-3.5 text-gray-400" />;
  
  switch (gender.toLowerCase()) {
    case 'male':
      return <Male className="h-3.5 w-3.5 text-blue-500" />;
    case 'female':
      return <Female className="h-3.5 w-3.5 text-pink-500" />;
    default:
      return <HelpCircle className="h-3.5 w-3.5 text-gray-400" />;
  }
};

/**
 * Calculate age in days from birth date
 */
export const calculateAgeInDays = (birthDate: string | null): number | null => {
  if (!birthDate) return null;
  
  try {
    const birth = new Date(birthDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    return null;
  }
};

/**
 * Convert age in days to weeks and days
 */
export const formatAge = (ageInDays: number | null): string => {
  if (ageInDays === null) return 'Unknown';
  
  const weeks = Math.floor(ageInDays / 7);
  const days = ageInDays % 7;
  
  if (weeks === 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  
  if (days === 0) {
    return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  }
  
  return `${weeks} week${weeks !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}`;
};

/**
 * Get the display color for a puppy's status
 */
export const getStatusColor = (status: string | null): string => {
  if (!status) return 'bg-gray-100 text-gray-800';
  
  switch (status.toLowerCase()) {
    case 'available':
      return 'bg-green-100 text-green-800';
    case 'reserved':
      return 'bg-amber-100 text-amber-800';
    case 'sold':
      return 'bg-blue-100 text-blue-800';
    case 'unavailable':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
