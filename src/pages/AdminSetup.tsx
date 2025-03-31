
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import OrganizationSetup from '@/components/admin/OrganizationSetup';
import UserManagement from '@/components/admin/UserManagement';
import PermissionsSetup from '@/components/admin/PermissionsSetup';
import PageContainer from '@/components/common/PageContainer';

const AdminSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isTenantAdmin, setIsTenantAdmin] = useState(false);
  const [tenantSettings, setTenantSettings] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUserPermissions();
  }, [user]);

  const checkUserPermissions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Check if the user is a tenant admin
      const { data: profileData, error: profileError } = await supabase
        .from('breeder_profiles')
        .select('role, tenant_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const isAdmin = profileData?.role === 'admin' || profileData?.role === 'owner';
      setIsTenantAdmin(isAdmin);

      // If admin, get tenant settings
      if (isAdmin && profileData.tenant_id) {
        try {
          // This section would load settings from a tenant_settings table if you have one
          // For now, we'll just set a placeholder
          setTenantSettings({
            id: profileData.tenant_id,
            name: 'Your Organization'
          });
        } catch (settingsError) {
          console.error('Error loading tenant settings:', settingsError);
        }
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to check your permissions.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewAuditLogs = () => {
    navigate('/audit-logs');
  };

  if (loading) {
    return (
      <PageContainer>
        <Card className="mx-auto">
          <CardContent className="pt-6">
            <div className="flex justify-center py-10">
              <p>Loading admin settings...</p>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <Card className="mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center py-10 text-center">
              <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
              <p className="mb-4">You need to be logged in to access admin settings.</p>
              <Button onClick={() => navigate('/auth')}>Login</Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (!isTenantAdmin) {
    return (
      <PageContainer>
        <Card className="mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center py-10 text-center">
              <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
              <p>You don't have permission to access admin settings.</p>
              <Button onClick={handleBackToDashboard} className="mt-4">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground mt-2">
              Configure your organization, manage users, and set access permissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleViewAuditLogs}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              View Audit Logs
            </Button>
            <Button 
              variant="outline" 
              onClick={handleBackToDashboard}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>

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
                  onSubmit={async (data) => {
                    toast({
                      title: 'Organization updated',
                      description: 'Your organization settings have been saved.'
                    });
                  }} 
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
      </div>
    </PageContainer>
  );
};

export default AdminSetup;
