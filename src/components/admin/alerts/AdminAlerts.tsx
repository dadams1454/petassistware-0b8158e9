
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { isValidUUID } from '@/utils/uuidUtils';

interface AdminErrorAlertProps {
  error: string | null;
  tenantSettings: any;
  onRetry: () => void;
}

export const AdminErrorAlert: React.FC<AdminErrorAlertProps> = ({
  error,
  tenantSettings,
  onRetry
}) => {
  if (!error) return null;
  
  const isUuidFormatError = error?.includes('Invalid UUID format') || 
                          error?.includes('invalid input syntax for type uuid') || 
                          (tenantSettings?.id && !isValidUUID(tenantSettings.id));

  return (
    <Alert variant={isUuidFormatError ? "destructive" : "warning"} className={`${isUuidFormatError ? 'bg-red-50 border-l-4 border-red-400' : 'bg-yellow-50 border-l-4 border-yellow-400'} p-4 mb-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {isUuidFormatError ? (
            <ShieldAlert className="h-5 w-5 text-red-400" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          )}
        </div>
        <div className="ml-3">
          <AlertTitle className={`text-sm font-medium ${isUuidFormatError ? 'text-red-700' : 'text-yellow-700'}`}>
            {isUuidFormatError ? 'UUID Format Error' : 'Backend Connection Issue'}
          </AlertTitle>
          <AlertDescription className={`text-sm ${isUuidFormatError ? 'text-red-700' : 'text-yellow-700'}`}>
            {error}
            {isUuidFormatError && (
              <div className="mt-2 font-medium">
                Please navigate to the Organization tab below and use the 'Generate New ID' button to create a valid UUID.
              </div>
            )}
          </AlertDescription>
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="flex items-center text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry Loading Settings
            </Button>
          </div>
        </div>
      </div>
    </Alert>
  );
};

export const SetupRequiredAlert: React.FC<{ needsSetup: boolean }> = ({ needsSetup }) => {
  if (!needsSetup) return null;
  
  return (
    <Alert className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Organization Setup Required</AlertTitle>
      <AlertDescription>
        Your organization needs to be set up. Please complete the organization settings below.
      </AlertDescription>
    </Alert>
  );
};
