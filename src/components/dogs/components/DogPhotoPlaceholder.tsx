
import React from 'react';
import { PawPrint } from 'lucide-react';

interface DogPhotoPlaceholderProps {
  gender?: string;
  size?: 'sm' | 'md' | 'lg';
}

const DogPhotoPlaceholder: React.FC<DogPhotoPlaceholderProps> = ({ 
  gender = 'unknown',
  size = 'md'
}) => {
  // Set color based on gender
  const bgColor = gender?.toLowerCase() === 'female' 
    ? 'bg-pink-100 dark:bg-pink-900/20' 
    : gender?.toLowerCase() === 'male'
    ? 'bg-blue-100 dark:bg-blue-900/20'
    : 'bg-gray-100 dark:bg-gray-800';
  
  const iconColor = gender?.toLowerCase() === 'female' 
    ? 'text-pink-500 dark:text-pink-400' 
    : gender?.toLowerCase() === 'male'
    ? 'text-blue-500 dark:text-blue-400'
    : 'text-gray-500 dark:text-gray-400';

  // Set size
  const sizeClass = size === 'sm' 
    ? 'h-12 w-12'
    : size === 'lg'
    ? 'h-48 w-full'
    : 'h-24 w-24';
  
  const iconSize = size === 'sm' 
    ? 'h-6 w-6'
    : size === 'lg'
    ? 'h-16 w-16'
    : 'h-10 w-10';

  return (
    <div className={`${bgColor} ${sizeClass} flex items-center justify-center w-full h-full`}>
      <PawPrint className={`${iconColor} ${iconSize}`} />
    </div>
  );
};

export default DogPhotoPlaceholder;
