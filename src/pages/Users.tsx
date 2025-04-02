
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import UserManagement from '@/components/admin/UserManagement';

interface UsersProps {
  tenantId?: string;
}

const Users: React.FC<UsersProps> = ({ tenantId }) => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="User Management"
          subtitle="Manage user accounts and permissions"
          className="mb-6"
        />
        
        <UserManagement tenantId={tenantId} />
      </div>
    </PageContainer>
  );
};

export default Users;
