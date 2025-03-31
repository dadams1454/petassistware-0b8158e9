
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminSetup } from '@/hooks/useAdminSetup';
import AdminLoadingState from '@/components/admin/AdminLoadingState';
import AdminUnauthorizedState from '@/components/admin/AdminUnauthorizedState';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabsContent from '@/components/admin/AdminTabsContent';
import PageContainer from '@/components/common/PageContainer';
import { ErrorState } from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminSetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, isTenantAdmin, tenantSettings, error, reloadSettings } = useAdminSetup();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewAuditLogs = () => {
    navigate('/audit-logs');
  };

  const handleRetry = () => {
    reloadSettings();
    toast({
      title: 'Refreshing...',
      description: 'Attempting to reload admin settings'
    });
  };

  if (loading) {
    return <AdminLoadingState />;
  }

  if (!user) {
    return <AdminUnauthorizedState type="unauthenticated" />;
  }

  if (!isTenantAdmin) {
    return <AdminUnauthorizedState type="unauthorized" />;
  }

  const isUuidFormatError = error?.includes('invalid input syntax for type uuid');

  return (
    <PageContainer>
      <div className="space-y-6 w-full">
        <AdminHeader 
          onViewAuditLogs={handleViewAuditLogs}
          onBackToDashboard={handleBackToDashboard}
        />
        
        {error && (
          <Alert variant={isUuidFormatError ? "destructive" : "warning"} className={`${isUuidFormatError ? 'bg-red-50 border-l-4 border-red-400' : 'bg-yellow-50 border-l-4 border-yellow-400'} p-4 mb-4`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className={`h-5 w-5 ${isUuidFormatError ? 'text-red-400' : 'text-yellow-400'}`} />
              </div>
              <div className="ml-3">
                <AlertTitle className={`text-sm ${isUuidFormatError ? 'text-red-700' : 'text-yellow-700'}`}>
                  {isUuidFormatError ? 'UUID Format Error' : 'Backend Connection Issue'}
                </AlertTitle>
                <AlertDescription className={`text-sm ${isUuidFormatError ? 'text-red-700' : 'text-yellow-700'}`}>
                  {isUuidFormatError 
                    ? "Your tenant ID is not in a valid UUID format. Please use the 'Generate New ID' button in the Organization tab below."
                    : error}
                </AlertDescription>
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRetry}
                    className="flex items-center text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry Loading Settings
                  </Button>
                </div>
              </div>
            </div>
          </Alert>
        )}
        
        {tenantSettings?.needsSetup && !error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Organization Setup Required</AlertTitle>
            <AlertDescription>
              Your organization needs to be set up. Please complete the organization settings below.
            </AlertDescription>
          </Alert>
        )}
        
        <AdminTabsContent tenantSettings={tenantSettings} />
      </div>
    </PageContainer>
  );
};

export default AdminSetup;
