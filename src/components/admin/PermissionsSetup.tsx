
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/ui/standardized';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PermissionsSetupProps {
  tenantId?: string;
}

// Define sample permission modules
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

// Define sample roles
const roles = [
  { name: 'Admin', key: 'admin', description: 'Full access to all features' },
  { name: 'Manager', key: 'manager', description: 'Can manage most aspects but cannot delete or modify system settings' },
  { name: 'Breeder', key: 'breeder', description: 'Can manage dogs and litters but limited customer access' },
  { name: 'Assistant', key: 'assistant', description: 'Limited read access and basic operations' },
];

const PermissionsSetup: React.FC<PermissionsSetupProps> = ({ tenantId }) => {
  const { toast } = useToast();
  
  // Mock permissions matrix - in a real app, this would be fetched from your backend
  const mockPermissionsMatrix: Record<string, Record<string, boolean>> = {
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

  const handleSavePermissions = () => {
    toast({
      title: "Permissions Saved",
      description: "Role permissions have been updated successfully.",
      variant: "default",
    });
  };

  if (!tenantId) {
    return <EmptyState title="No Organization Selected" description="Please set up your organization details first." />;
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
                            checked={mockPermissionsMatrix[role.key][permission.key]} 
                            disabled={role.key === 'admin'} // Admin always has all permissions
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
