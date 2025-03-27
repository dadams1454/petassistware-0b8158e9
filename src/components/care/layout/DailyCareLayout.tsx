
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategorySelector from '../categories/CategorySelector';
import { CareCategory } from '@/types/careCategories';

interface DailyCareLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
  activeCategory: CareCategory;
  onCategoryChange: (category: CareCategory) => void;
}

const DailyCareLayout: React.FC<DailyCareLayoutProps> = ({
  children,
  title,
  description,
  onRefresh,
  isLoading = false,
  activeCategory,
  onCategoryChange
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>
      
      <CategorySelector 
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
      
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default DailyCareLayout;
