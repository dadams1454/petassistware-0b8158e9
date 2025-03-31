
import React from 'react';
import { useAdminSetup } from '@/hooks/useAdminSetup';
import AdminLoadingState from '@/components/admin/AdminLoadingState';
import AdminUnauthorizedState from '@/components/admin/AdminUnauthorizedState';
import AdminSetupContent from '@/components/admin/AdminSetupContent';
import PageContainer from '@/components/common/PageContainer';

const AdminSetup: React.FC = () => {
  const { user, loading, isTenantAdmin } = useAdminSetup();

  if (loading) {
    return <AdminLoadingState />;
  }

  if (!user) {
    return <AdminUnauthorizedState type="unauthenticated" />;
  }

  if (!isTenantAdmin) {
    return <AdminUnauthorizedState type="unauthorized" />;
  }

  return (
    <PageContainer>
      <AdminSetupContent />
    </PageContainer>
  );
};

export default AdminSetup;
