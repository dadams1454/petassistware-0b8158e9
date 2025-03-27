
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: EmptyStateAction;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  action,
  className
}) => {
  return (
    <Card className={`border shadow-sm ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-8">
        {icon && (
          <div className="mb-4 rounded-full bg-muted p-3">
            {icon}
          </div>
        )}
        <h3 className="mb-2 text-lg font-medium">{title}</h3>
        <p className="mb-4 text-center text-sm text-muted-foreground max-w-sm">{description}</p>
        {action && (
          <Button 
            onClick={action.onClick} 
            variant={action.variant || 'default'}
            className="mt-2"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
