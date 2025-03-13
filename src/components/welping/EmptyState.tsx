
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Button onClick={onAction} className="gap-2">
        <Plus className="h-4 w-4" />
        {actionText}
      </Button>
    </div>
  );
};
