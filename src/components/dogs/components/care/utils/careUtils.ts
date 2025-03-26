
import { formatDistanceToNow } from 'date-fns';
import { 
  Clock, 
  Bath, 
  Utensils, 
  Heart, 
  Activity, 
  PawPrint, 
  Pill 
} from 'lucide-react';
import React from 'react';

// Get icon component based on care category
export const getCareTypeIcon = (category: string): React.ReactNode => {
  switch (category?.toLowerCase()) {
    case 'feeding':
      return <Utensils />;
    case 'grooming':
      return <Bath />;
    case 'exercise':
      return <Activity />;
    case 'medications':
      return <Pill />;
    case 'healthcare':
      return <Heart />;
    case 'potty':
    case 'pottybreaks':
      return <PawPrint />;
    default:
      return <Clock />;
  }
};

// Get color based on care category
export const getCareTypeColor = (category: string): string => {
  switch (category?.toLowerCase()) {
    case 'feeding':
      return 'blue';
    case 'grooming':
      return 'pink';
    case 'exercise':
      return 'green';
    case 'medications':
      return 'red';
    case 'healthcare':
      return 'purple';
    case 'potty':
    case 'pottybreaks':
      return 'yellow';
    default:
      return 'gray';
  }
};

// Get human-readable relative time
export const getRelativeTimeString = (date: Date): string => {
  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (err) {
    console.error('Error formatting date:', err);
    return 'Unknown time';
  }
};
