
import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  variant?: 'default' | 'card' | 'table' | 'text' | 'banner';
  width?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  count = 3, 
  variant = 'default',
  width = 'w-full', 
  className = '' 
}) => {
  const renderSkeleton = (index: number) => {
    switch (variant) {
      case 'card':
        return (
          <div key={index} className={`animate-pulse rounded-lg border p-4 ${className}`}>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mt-4"></div>
          </div>
        );
      case 'table':
        return (
          <div key={index} className={`animate-pulse ${className}`}>
            <div className="grid grid-cols-4 gap-4 mb-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        );
      case 'text':
        return (
          <div key={index} className={`animate-pulse ${className}`}>
            <div className={`h-4 bg-slate-200 dark:bg-slate-700 rounded ${width} mb-2`}></div>
          </div>
        );
      case 'banner':
        return (
          <div key={index} className={`animate-pulse rounded-lg ${className}`}>
            <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        );
      default:
        return (
          <div key={index} className={`animate-pulse ${className}`}>
            <div className={`h-4 bg-slate-200 dark:bg-slate-700 rounded ${width} mb-2`}></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </div>
  );
};

export default SkeletonLoader;
