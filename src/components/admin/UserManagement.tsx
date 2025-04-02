
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserManagementProps {
  tenantId?: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ tenantId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Manage user accounts and permissions here
          {tenantId && <span> for tenant {tenantId}</span>}
        </p>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
