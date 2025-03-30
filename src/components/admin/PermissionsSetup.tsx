
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface PermissionsSetupProps {
  tenantId?: string;
}

type Role = 'admin' | 'manager' | 'staff' | 'user';

interface Permission {
  id: string;
  name: string;
  description: string;
  roles: {
    [key in Role]: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    }
  }
}

const defaultPermissions: Permission[] = [
  {
    id: 'dogs',
    name: 'Dogs',
    description: 'Manage dog profiles and records',
    roles: {
      admin: { view: true, create: true, edit: true, delete: true },
      manager: { view: true, create: true, edit: true, delete: false },
      staff: { view: true, create: true, edit: true, delete: false },
      user: { view: true, create: false, edit: false, delete: false }
    }
  },
  {
    id: 'litters',
    name: 'Litters',
    description: 'Manage litters and puppies',
    roles: {
      admin: { view: true, create: true, edit: true, delete: true },
      manager: { view: true, create: true, edit: true, delete: false },
      staff: { view: true, create: false, edit: false, delete: false },
      user: { view: false, create: false, edit: false, delete: false }
    }
  },
  {
    id: 'customers',
    name: 'Customers',
    description: 'Manage customer information',
    roles: {
      admin: { view: true, create: true, edit: true, delete: true },
      manager: { view: true, create: true, edit: true, delete: false },
      staff: { view: true, create: true, edit: true, delete: false },
      user: { view: false, create: false, edit: false, delete: false }
    }
  },
  {
    id: 'users',
    name: 'Users',
    description: 'Manage user accounts',
    roles: {
      admin: { view: true, create: true, edit: true, delete: true },
      manager: { view: false, create: false, edit: false, delete: false },
      staff: { view: false, create: false, edit: false, delete: false },
      user: { view: false, create: false, edit: false, delete: false }
    }
  },
];

const PermissionsSetup: React.FC<PermissionsSetupProps> = ({ tenantId }) => {
  const [permissions, setPermissions] = useState<Permission[]>(defaultPermissions);
  const [activeRole, setActiveRole] = useState<Role>('admin');
  
  const handlePermissionChange = (
    permissionId: string,
    action: 'view' | 'create' | 'edit' | 'delete',
    checked: boolean
  ) => {
    setPermissions(permissions.map(permission => {
      if (permission.id === permissionId) {
        return {
          ...permission,
          roles: {
            ...permission.roles,
            [activeRole]: {
              ...permission.roles[activeRole],
              [action]: checked
            }
          }
        };
      }
      return permission;
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Role-Based Access Control</h3>
        <p className="text-muted-foreground">
          Define what each role in your organization can do.
        </p>
      </div>
      
      <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as Role)}>
        <TabsList className="mb-4">
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="manager">Manager</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="user">User</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Resource</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">View</TableHead>
                  <TableHead className="text-center">Create</TableHead>
                  <TableHead className="text-center">Edit</TableHead>
                  <TableHead className="text-center">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">
                      {permission.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {permission.description}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={permission.roles[activeRole].view}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.id, 'view', checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={permission.roles[activeRole].create}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.id, 'create', checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={permission.roles[activeRole].edit}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.id, 'edit', checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={permission.roles[activeRole].delete}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.id, 'delete', checked)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Role Descriptions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Admin</h4>
                <Badge>Highest Access</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Full access to all features including user management and system settings.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Manager</h4>
                <Badge variant="secondary">High Access</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Can manage most breeding operations but cannot manage users or system settings.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Staff</h4>
                <Badge variant="outline">Limited Access</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Day-to-day operations like dog care, customer interactions, and data entry.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">User</h4>
                <Badge variant="outline">Basic Access</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Read-only access to basic information. Typically for customers or temporary access.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PermissionsSetup;
