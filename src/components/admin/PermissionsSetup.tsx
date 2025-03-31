
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/ui/standardized';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PermissionsSetupProps {
  tenantId?: string;
}

// Define permission modules
const permissionModules = [
  {
    name: 'Dogs',
    permissions: [
      { name: 'View Dogs', key: 'dogs.view' },
      { name: 'Create Dogs', key: 'dogs.create' },
      { name: 'Edit Dogs', key: 'dogs.edit' },
      { name: 'Delete Dogs', key: 'dogs.delete' },
    ],
  },
  {
    name: 'Litters',
    permissions: [
      { name: 'View Litters', key: 'litters.view' },
      { name: 'Create Litters', key: 'litters.create' },
      { name: 'Edit Litters', key: 'litters.edit' },
      { name: 'Delete Litters', key: 'litters.delete' },
    ],
  },
  {
    name: 'Customers',
    permissions: [
      { name: 'View Customers', key: 'customers.view' },
      { name: 'Create Customers', key: 'customers.create' },
      { name: 'Edit Customers', key: 'customers.edit' },
      { name: 'Delete Customers', key: 'customers.delete' },
    ],
  },
];

// Define roles
const roles = [
  { name: 'Admin', key: 'admin', description: 'Full access to all features' },
  { name: 'Manager', key: 'manager', description: 'Can manage most aspects but cannot delete or modify system settings' },
  { name: 'Breeder', key: 'breeder', description: 'Can manage dogs and litters but limited customer access' },
  { name: 'Assistant', key: 'assistant', description: 'Limited read access and basic operations' },
];

const PermissionsSetup: React.FC<PermissionsSetupProps> = ({ tenantId }) => {
  const { toast } = useToast();
  const [permissionsMatrix, setPermissionsMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Initialize with defaults until we implement proper permissions storage
    const defaultMatrix: Record<string, Record<string, boolean>> = {
      admin: Object.fromEntries(
        permissionModules.flatMap(module => 
          module.permissions.map(permission => [permission.key, true])
        )
      ),
      manager: Object.fromEntries(
        permissionModules.flatMap(module => 
          module.permissions.map(permission => [permission.key, 
            !permission.key.includes('delete') && !permission.key.includes('system')
          ])
        )
      ),
      breeder: Object.fromEntries(
        permissionModules.flatMap(module => 
          module.permissions.map(permission => [permission.key, 
            (module.name === 'Dogs' || module.name === 'Litters') && !permission.key.includes('delete')
          ])
        )
      ),
      assistant: Object.fromEntries(
        permissionModules.flatMap(module => 
          module.permissions.map(permission => [permission.key, 
            permission.key.includes('view')
          ])
        )
      ),
    };
    
    setPermissionsMatrix(defaultMatrix);
    setLoading(false);
  }, []);

  const handlePermissionChange = (role: string, permissionKey: string, value: boolean) => {
    setPermissionsMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permissionKey]: value
      }
    }));
  };

  const handleSavePermissions = async () => {
    try {
      // Here we would save the permissions matrix to the database
      // For now, we'll just show a success message
      
      toast({
        title: "Permissions Saved",
        description: "Role permissions have been updated successfully.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to save permissions: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  if (!tenantId) {
    return <EmptyState title="No Organization Selected" description="Please set up your organization details first." />;
  }

  if (loading) {
    return <div className="py-4">Loading permissions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Role-Based Permissions</h3>
        <Button onClick={handleSavePermissions}>Save Changes</Button>
      </div>
      
      <Card>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Permission</TableHead>
                {roles.map(role => (
                  <TableHead key={role.key} className="text-center">
                    {role.name}
                    <div className="text-xs font-normal text-muted-foreground">{role.description}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionModules.map(module => (
                <React.Fragment key={module.name}>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={roles.length + 1} className="font-medium">
                      {module.name}
                    </TableCell>
                  </TableRow>
                  {module.permissions.map(permission => (
                    <TableRow key={permission.key}>
                      <TableCell>{permission.name}</TableCell>
                      {roles.map(role => (
                        <TableCell key={`${role.key}-${permission.key}`} className="text-center">
                          <Switch 
                            checked={permissionsMatrix[role.key]?.[permission.key] || false} 
                            disabled={role.key === 'admin'} // Admin always has all permissions
                            onCheckedChange={(checked) => {
                              if (role.key !== 'admin') {
                                handlePermissionChange(role.key, permission.key, checked);
                              }
                            }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsSetup;
