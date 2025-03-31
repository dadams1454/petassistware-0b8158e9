
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import OrganizationSetup from '@/components/admin/OrganizationSetup';
import UserManagement from '@/components/admin/UserManagement';
import PermissionsSetup from '@/components/admin/PermissionsSetup';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { isValidUUID } from '@/utils/uuidUtils';

interface AdminTabsContentProps {
  tenantSettings: any;
}

const AdminTabsContent: React.FC<AdminTabsContentProps> = ({ tenantSettings }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleOrganizationSubmit = async (data: any) => {
    try {
      // Ensure we have a valid UUID
      if (!isValidUUID(data.tenantId)) {
        throw new Error("A valid UUID is required for tenant ID. Please generate a new one using the 'Generate New ID' button.");
      }
      
      // Make an actual update to the breeder_profiles table
      if (data.tenantId) {
        // Get the current user's email to ensure we have all required fields
        if (!user || !user.email) {
          throw new Error("User email is required but not available");
        }
        
        const { error } = await supabase
          .from('breeder_profiles')
          .upsert({
            id: user.id, // Required field: id
            email: user.email, // Required field: email
            tenant_id: data.tenantId,
            business_name: data.name,
            business_overview: data.description,
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          console.error('Supabase error during organization update:', error);
          if (error.code === '22P02') {
            throw new Error("UUID format error. Please generate a new UUID using the 'Generate New ID' button.");
          }
          throw error;
        }
      }
      
      toast({
        title: 'Organization updated',
        description: 'Your organization settings have been saved.'
      });
      
      // Force page reload to reflect the new tenant ID
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      return Promise.resolve(data);
    } catch (error: any) {
      console.error('Error saving organization settings:', error);
      toast({
        title: 'Error saving settings',
        description: error.message || 'There was a problem saving your organization settings.',
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
            <PermissionsSetup tenantId={tenantSettings?.id} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabsContent;
