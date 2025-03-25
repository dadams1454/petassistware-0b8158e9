
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string; // Added for backward compatibility
  backLink?: string;
  actions?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  backLink,
  actions,
  action
}) => {
  const navigate = useNavigate();
  // Use either subtitle or description, preferring subtitle if both are provided
  const displaySubtitle = subtitle || description;

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {backLink && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 mr-2"
            onClick={() => navigate(backLink)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {displaySubtitle && <p className="text-sm text-muted-foreground mt-1">{displaySubtitle}</p>}
        </div>
      </div>
      
      {actions || (action && (
        <Button onClick={action.onClick}>
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default PageHeader;
