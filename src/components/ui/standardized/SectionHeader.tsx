
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import ActionButton from './ActionButton';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
  onRefresh?: () => void;
  className?: string;
  children?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  };
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  onAdd,
  addLabel = "Add New",
  onRefresh,
  className,
  children,
  action
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4", className)}>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="flex items-center space-x-3 mt-2 sm:mt-0">
        {children}
        
        {action && (
          <ActionButton
            label={action.label}
            onClick={action.onClick}
            icon={action.icon}
            variant={action.variant || "default"}
          />
        )}
        
        {onAdd && !action && (
          <Button onClick={onAdd} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        )}
        
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
