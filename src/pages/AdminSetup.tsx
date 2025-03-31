
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminSetup } from '@/hooks/useAdminSetup';
import AdminLoadingState from '@/components/admin/AdminLoadingState';
import AdminUnauthorizedState from '@/components/admin/AdminUnauthorizedState';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabsContent from '@/components/admin/AdminTabsContent';
import PageContainer from '@/components/common/PageContainer';
import { ErrorState } from '@/components/ui/standardized';

const AdminSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, isTenantAdmin, tenantSettings, error } = useAdminSetup();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewAuditLogs = () => {
    navigate('/audit-logs');
  };

  if (loading) {
    return <AdminLoadingState />;
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState 
          title="Error Loading Settings" 
          message={error} 
          onRetry={() => window.location.reload()}
        />
      </PageContainer>
    );
  }

  if (!user) {
    return <AdminUnauthorizedState type="unauthenticated" />;
  }

  if (!isTenantAdmin) {
    return <AdminUnauthorizedState type="unauthorized" />;
  }

  return (
    <PageContainer>
      <div className="space-y-6 w-full">
        <AdminHeader 
          onViewAuditLogs={handleViewAuditLogs}
          onBackToDashboard={handleBackToDashboard}
        />
        
        <AdminTabsContent tenantSettings={tenantSettings} />
      </div>
    </PageContainer>
  );
};

export default AdminSetup;
