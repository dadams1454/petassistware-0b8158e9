
import React from 'react';
import { CircleUser, Heart } from 'lucide-react';
import { format } from 'date-fns';

// Helper to render gender icon
export const renderGenderIcon = (gender: string | null) => {
  if (gender === 'Male') {
    return <CircleUser className="h-3.5 w-3.5 text-blue-500 mr-1" />;
  } else if (gender === 'Female') {
    return <Heart className="h-3.5 w-3.5 text-pink-500 mr-1" />;
  }
  return null;
};

// Format date helper
export const formatDate = (date: string | null) => {
  return date ? format(new Date(date), 'MMM d, yyyy') : 'N/A';
};
