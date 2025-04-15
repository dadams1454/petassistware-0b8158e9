
import React from 'react';
import { EmptyState } from '@/components/ui/standardized';
import { PlusCircle, SearchX } from 'lucide-react';

interface NoDogsFoundProps {
  hasSearch?: boolean;
  onAddClick?: () => void;
}

const NoDogsFound = ({ hasSearch = false, onAddClick }: NoDogsFoundProps) => {
  if (hasSearch) {
    return (
      <EmptyState
        title="No matching dogs"
        description="No dogs found matching your search criteria. Try adjusting your filters."
        icon={<SearchX className="h-12 w-12 text-muted-foreground" />}
        action={onAddClick ? {
          label: "Clear Filters",
          onClick: onAddClick
        } : undefined}
      />
    );
  }
  
  return (
    <EmptyState
      title="No dogs found"
      description="You haven't added any dogs yet. Click the 'Add Dog' button to get started."
      icon={<PlusCircle className="h-12 w-12 text-muted-foreground" />}
      action={onAddClick ? {
        label: "Add Dog",
        onClick: onAddClick
      } : undefined}
    />
  );
};

export default NoDogsFound;
