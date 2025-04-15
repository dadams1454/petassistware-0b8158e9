
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circle' | 'rect' | 'card' | 'table' | 'profile';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
  inline?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  className,
  count = 1,
  inline = false,
}) => {
  const skeletons = Array(count).fill(0);
  
  const getSkeletonStyles = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full aspect-square';
      case 'rect':
        return 'rounded';
      case 'card':
        return 'rounded-lg h-[200px]';
      case 'table':
        return 'h-10 rounded';
      case 'profile':
        return 'rounded-full w-12 h-12';
      case 'text':
      default:
        return 'h-4 rounded';
    }
  };
  
  const baseStyles = cn(
    'bg-muted/60 animate-pulse',
    getSkeletonStyles(),
    className
  );
  
  const containerStyles = inline ? 'flex gap-2' : 'space-y-2';
  
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;
  
  return (
    <div className={containerStyles}>
      {skeletons.map((_, index) => (
        <div key={index} className={baseStyles} style={style} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
