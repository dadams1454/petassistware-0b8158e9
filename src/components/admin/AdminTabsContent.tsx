
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import OrganizationSetup from '@/components/admin/OrganizationSetup';
import UserManagement from '@/components/admin/UserManagement';
import PermissionsSetup from '@/components/admin/PermissionsSetup';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AdminTabsContentProps {
  tenantSettings: any;
}

const AdminTabsContent: React.FC<AdminTabsContentProps> = ({ tenantSettings }) => {
  const { toast } = useToast();
  
  const handleOrganizationSubmit = async (data: any) => {
    try {
      // Since we're operating without a backend, just simulate success
      console.log('Organization settings to save:', data);
      
      toast({
        title: 'Organization updated',
        description: 'Your organization settings have been saved.'
      });
      
      return Promise.resolve(data);
    } catch (error) {
      console.error('Error saving organization settings:', error);
      toast({
        title: 'Error saving settings',
        description: 'There was a problem saving your organization settings.',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }
  };
  
  return (
    <Tabs defaultValue="organization" className="space-y-6 w-full">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="organization">Organization</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>

      <TabsContent value="organization">
        <Card>
          <CardHeader>
            <CardTitle>Organization Settings</CardTitle>
            <CardDescription>
              Configure your organization's profile and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <OrganizationSetup 
              initialData={tenantSettings} 
              onSubmit={handleOrganizationSubmit} 
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage users and assign roles within your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Demo Mode</AlertTitle>
              <AlertDescription>
                User management functionality is currently in demo mode as the backend tables are not yet set up.
              </AlertDescription>
            </Alert>
            <UserManagement tenantId={tenantSettings?.id} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="permissions">
        <Card>
          <CardHeader>
            <CardTitle>Access Permissions</CardTitle>
            <CardDescription>
              Configure role-based access controls for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Demo Mode</AlertTitle>
              <AlertDescription>
                Permissions functionality is currently in demo mode as the backend tables are not yet set up.
              </AlertDescription>
            </Alert>
            <PermissionsSetup tenantId={tenantSettings?.id} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabsContent;
