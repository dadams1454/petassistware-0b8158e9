import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NoDogsMessage from './NoDogsMessage';
import { getAvatarByCategory } from '../../utils/getAvatarByCategory';

interface TableContainerProps {
  activeCategory: string;
  dogsCount: number;
  onRefresh: () => void;
  isLoading?: boolean;
  isMobile?: boolean;
  children: React.ReactNode;
}

const TableContainer: React.FC<TableContainerProps> = ({
  activeCategory,
  dogsCount,
  onRefresh,
  isLoading = false,
  isMobile = false,
  children
}) => {
  // Get the appropriate icon for the category
  const CategoryIcon = getAvatarByCategory(activeCategory);
  
  // If there are no dogs, display a message
  if (dogsCount === 0) {
    return (
      <div className="p-6 bg-white dark:bg-gray-950">
        <NoDogsMessage
          title={`No dogs found for ${activeCategory} tracking`}
          description="Add dogs to see their care schedule"
          icon={CategoryIcon}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="mt-4"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </NoDogsMessage>
      </div>
    );
  }
  
  // Otherwise, render the table
  return (
    <div className="relative overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
      {children}
    </div>
  );
};

export default TableContainer;
