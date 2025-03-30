
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertTriangle, 
  Settings2, 
  Users, 
  Check,
  Lock,
  UserCog 
} from 'lucide-react';
import { RoleSelector } from '@/components/user-management/RoleSelector';
import { supabase } from '@/integrations/supabase/client';

const AdminSetup: React.FC = () => {
  const { userRole, user, tenantId } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [defaultRole, setDefaultRole] = useState<string>('viewer');
  const [tenantName, setTenantName] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Only admin users should have access to this page
  const isAdmin = userRole === 'admin';

  const handleSaveTenant = async () => {
    if (!isAdmin || !user || !tenantId) {
      toast({
        title: 'Error',
        description: 'You need to be an administrator to update tenant settings',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Update tenant settings in a tenant_settings table
      const { error } = await supabase
        .from('tenant_settings')
        .upsert({
          tenant_id: tenantId,
          name: tenantName,
          default_role: defaultRole,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      toast({
        title: 'Success',
        description: 'Organization settings updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating tenant settings:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update organization settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageUsers = () => {
    navigate('/users');
  };

  // If not admin, show unauthorized message
  if (!isAdmin) {
    return (
      <PageContainer>
        <div className="container mx-auto py-6 px-4">
          <PageHeader 
            title="Admin Setup"
            subtitle="Configure system settings and permissions"
            className="mb-6"
          />
          
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-amber-700">Access Restricted</CardTitle>
              </div>
              <CardDescription className="text-amber-600">
                This area is only accessible to administrators.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700">
                You need administrator privileges to access the system configuration settings.
                Please contact your system administrator for assistance.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="Admin Setup"
          subtitle="Configure system settings and permissions"
          className="mb-6"
        />
        
        <Tabs defaultValue="organization">
          <TabsList className="mb-4">
            <TabsTrigger value="organization" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Permissions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>
                  Configure your organization's basic information and default settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="tenant-name">Organization Name</Label>
                  <Input 
                    id="tenant-name"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="Enter your organization's name"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="default-role">Default Role for New Users</Label>
                  <RoleSelector 
                    value={defaultRole}
                    onChange={setDefaultRole}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This role will be automatically assigned to newly invited users.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveTenant} 
                  disabled={loading || showSuccess}
                  className="relative"
                >
                  {showSuccess ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      {loading ? 'Saving...' : 'Save Settings'}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage users, invitations, and role assignments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center p-4 border rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <h3 className="font-medium">User Accounts</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage existing users, invite new users, and assign roles
                      </p>
                    </div>
                    <Button onClick={handleManageUsers} className="flex items-center gap-2">
                      <UserCog className="h-4 w-4" />
                      Manage Users
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>System Permissions</CardTitle>
                <CardDescription>
                  Configure access controls and role-based permissions for different parts of the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border p-4 rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-2">Permission Configuration</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The system uses a role-based access control system. Permissions are predefined
                      based on user roles. To change permissions, assign different roles to users.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-2 font-medium text-sm px-2 py-1 border-b">
                        <div>Resource</div>
                        <div>View</div>
                        <div>Create/Edit</div>
                        <div>Delete</div>
                      </div>
                      
                      {[
                        { name: 'Dogs', viewer: true, staff: true, admin: true, staffEdit: true, adminDelete: true },
                        { name: 'Litters', viewer: true, staff: true, admin: true, staffEdit: false, adminDelete: true },
                        { name: 'Customers', viewer: false, staff: true, admin: true, staffEdit: true, adminDelete: true },
                        { name: 'Calendar', viewer: true, staff: true, admin: true, staffEdit: true, adminDelete: true },
                        { name: 'Communications', viewer: false, staff: false, admin: true, staffEdit: false, adminDelete: true },
                        { name: 'Users', viewer: false, staff: false, admin: true, staffEdit: false, adminDelete: true },
                      ].map((resource, i) => (
                        <div key={i} className="grid grid-cols-4 gap-2 text-sm px-2 py-2 border-b last:border-0">
                          <div>{resource.name}</div>
                          <div className="flex items-center">
                            {resource.viewer ? <Check className="h-4 w-4 text-green-500" /> : "-"}
                            {resource.viewer && <span className="ml-1 text-xs text-muted-foreground">All roles</span>}
                            {!resource.viewer && resource.staff && <span className="ml-1 text-xs text-muted-foreground">Staff+</span>}
                            {!resource.viewer && !resource.staff && <span className="ml-1 text-xs text-muted-foreground">Admin only</span>}
                          </div>
                          <div className="flex items-center">
                            {resource.staffEdit ? <Check className="h-4 w-4 text-green-500" /> : "-"}
                            <span className="ml-1 text-xs text-muted-foreground">
                              {resource.staffEdit ? "Staff+" : "Manager+"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {resource.adminDelete ? <Check className="h-4 w-4 text-green-500" /> : "-"}
                            <span className="ml-1 text-xs text-muted-foreground">Admin only</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default AdminSetup;
