
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { UserManagement } from '@/components/admin/UserManagement';

const Users: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="User Management"
          subtitle="Manage user accounts and permissions"
          className="mb-6"
        />
        
        <UserManagement />
      </div>
    </PageContainer>
  );
};

export default Users;
