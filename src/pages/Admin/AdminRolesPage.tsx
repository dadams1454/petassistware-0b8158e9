
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const AdminRolesPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="Role-Based Access Control"
          subtitle="Manage roles and permissions across your organization"
          className="mb-6"
        />
        
        <div className="flex justify-end mb-6">
          <Button variant="default">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Role
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Roles Configuration</CardTitle>
            <CardDescription>
              Define and manage user roles in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-muted">
              <p className="font-mono text-sm">Coming soon: Role management matrix</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Permissions Matrix</CardTitle>
            <CardDescription>
              Configure which permissions are assigned to each role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-muted">
              <p className="font-mono text-sm">Coming soon: Permission configuration interface</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AdminRolesPage;
