
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  backPath?: string; // Make sure this property exists
  backLink?: string; // Alternative naming
  showAdminSetupLink?: boolean;
}

const UnauthorizedState: React.FC<UnauthorizedStateProps> = ({
  title = "Access Denied",
  description = "You don't have permission to access this resource",
  backPath,
  backLink,
  showAdminSetupLink = false
}) => {
  // Use either backPath or backLink (for backward compatibility)
  const navigateLink = backPath || backLink || "/dashboard";
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
      <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-6">
        <ShieldAlert className="h-12 w-12 text-red-500 dark:text-red-400" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline">
          <Link to={navigateLink}>Go Back</Link>
        </Button>
        
        {showAdminSetupLink && (
          <Button asChild>
            <Link to="/admin/setup">Set Up Permissions</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default UnauthorizedState;
