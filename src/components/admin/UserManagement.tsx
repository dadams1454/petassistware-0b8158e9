
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/standardized';

interface User {
  id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
}

interface UserManagementProps {
  tenantId?: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ tenantId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchUsers();
  }, [tenantId]);
  
  const fetchUsers = async () => {
    if (!tenantId) {
      setUsers([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('breeder_profiles')
        .select('*')
        .eq('tenant_id', tenantId);
        
      if (error) throw error;
      
      setUsers(data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to load users: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const inviteUser = async () => {
    toast({
      title: "Invite User",
      description: "Sending invitation to a new user...",
      variant: "default"
    });
    
    // This would be where you implement the actual user invitation functionality
    // For now, just show a toast that it would be implemented here
    setTimeout(() => {
      toast({
        title: "Feature in Progress",
        description: "User invitation functionality is being implemented.",
        variant: "default"
      });
    }, 1500);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'owner':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  if (loading) return <LoadingState message="Loading users..." />;
  if (error) return <ErrorState title="Error Loading Users" message={error} />;
  if (!users.length) return <EmptyState title="No Users Found" description="No users have been added to this organization yet." />;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Users ({users.length})</h3>
        <Button onClick={inviteUser}>Invite User</Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : 'Unnamed User'}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role || 'user'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
