
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Shield, Info } from 'lucide-react';
import { useMockSession, UserRole } from '@/hooks/useMockSession';
import { hasPermission, ResourceType, ActionType, getAvailableRoles } from '@/utils/RBAC';
import { PageHeader } from '@/components/ui/standardized';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';

const SecurityTest: React.FC = () => {
  const { user, logout, setActiveRole } = useMockSession();
  const [selectedResource, setSelectedResource] = useState<ResourceType>('dogs');
  const [selectedAction, setSelectedAction] = useState<ActionType>('view');
  
  const resources: ResourceType[] = [
    'dogs', 'litters', 'users', 'adminSetup',
    'breeding', 'customers', 'finance', 'kennel', 'health', 'settings'
  ];
  
  const actions: ActionType[] = ['view', 'add', 'edit', 'delete'];
  const roles = getAvailableRoles();
  
  const checkPermission = (role: UserRole): boolean => {
    return hasPermission(role, selectedResource, selectedAction);
  };
  
  const handleRoleChange = (role: UserRole) => {
    if (setActiveRole) {
      setActiveRole(role);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Security System Test"
        description="Test the role-based access control system"
        className="mb-8"
      />
      
      {!user ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Not Logged In</h3>
              <p className="text-muted-foreground mb-4">You need to be logged in to test security permissions</p>
              <Button asChild>
                <Link to="/login">Go to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Current Session</CardTitle>
              <CardDescription>Manage your session settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">User</h3>
                <p className="text-muted-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Active Role</h3>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => (
                    <Button 
                      key={role.value}
                      variant={user.role === role.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRoleChange(role.value)}
                    >
                      {role.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={logout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Permission Tester</CardTitle>
              <CardDescription>Test what each role can access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Select Resource</h3>
                  <ToggleGroup 
                    type="single" 
                    variant="outline"
                    value={selectedResource}
                    onValueChange={(value) => value && setSelectedResource(value as ResourceType)}
                    className="flex flex-wrap gap-1"
                  >
                    {resources.map((resource) => (
                      <ToggleGroupItem 
                        key={resource} 
                        value={resource}
                        className="text-xs capitalize"
                      >
                        {resource}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Select Action</h3>
                  <ToggleGroup 
                    type="single" 
                    variant="outline"
                    value={selectedAction}
                    onValueChange={(value) => value && setSelectedAction(value as ActionType)}
                  >
                    {actions.map((action) => (
                      <ToggleGroupItem 
                        key={action} 
                        value={action}
                        className="capitalize"
                      >
                        {action}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Results for: <span className="capitalize">{selectedAction}</span> <span className="capitalize">{selectedResource}</span></h3>
                  <div className="space-y-2">
                    {roles.map((role) => {
                      const hasAccess = checkPermission(role.value);
                      return (
                        <div key={role.value} className="flex items-center justify-between p-2 rounded border">
                          <div className="flex items-center space-x-2">
                            {hasAccess ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                            <span>{role.label}</span>
                          </div>
                          <Badge variant={hasAccess ? "success" : "destructive"}>
                            {hasAccess ? "Allowed" : "Denied"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded flex items-start space-x-2">
                  <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p>
                      This page lets you test the permission system used throughout the application.
                      Changes here only affect your current session and are used for testing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SecurityTest;
