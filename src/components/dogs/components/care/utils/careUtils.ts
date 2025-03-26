
import React from 'react';
import { 
  DropletIcon, 
  UtensilsCrossed, 
  Pill, 
  Scissors, 
  Dumbbell,
  HeartPulse,
  Graduation,
  FileText 
} from 'lucide-react';

export const getCareTypeIcon = (careType: string) => {
  switch (careType) {
    case 'potty':
      return <DropletIcon />;
    case 'feeding':
      return <UtensilsCrossed />;
    case 'medication':
      return <Pill />;
    case 'grooming':
      return <Scissors />;
    case 'exercise':
      return <Dumbbell />;
    case 'wellness':
      return <HeartPulse />;
    case 'training':
      return <Graduation />;
    default:
      return <FileText />;
  }
};

export const getCareTypeColor = (careType: string): string => {
  switch (careType) {
    case 'potty':
      return 'green';
    case 'feeding':
      return 'orange';
    case 'medication':
      return 'red';
    case 'grooming':
      return 'purple';
    case 'exercise':
      return 'blue';
    case 'wellness':
      return 'pink';
    case 'training':
      return 'indigo';
    default:
      return 'gray';
  }
};

export const getRelativeTimeString = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMin = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMin < 1) {
    return 'Just now';
  } else if (diffInMin < 60) {
    return `${diffInMin} ${diffInMin === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString();
  }
};
