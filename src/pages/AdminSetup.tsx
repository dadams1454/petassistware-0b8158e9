
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

const AdminSetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, isTenantAdmin, tenantSettings, error } = useAdminSetup();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewAuditLogs = () => {
    navigate('/audit-logs');
  };

  const handleRetry = () => {
    window.location.reload();
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

  // Always check for settings first, not just error
  if (!tenantSettings) {
    return (
      <PageContainer>
        <ErrorState 
          title="Error Loading Settings" 
          message={error || "Unable to load organization settings"} 
          onRetry={handleRetry}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6 w-full">
        <AdminHeader 
          onViewAuditLogs={handleViewAuditLogs}
          onBackToDashboard={handleBackToDashboard}
        />
        
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {error}
                </p>
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
          </div>
        )}
        
        <AdminTabsContent tenantSettings={tenantSettings} />
      </div>
    </PageContainer>
  );
};

export default AdminSetup;
