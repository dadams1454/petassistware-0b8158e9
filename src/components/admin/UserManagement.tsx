
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import { supabase } from '@/integrations/supabase/client';

interface UserManagementProps {
  tenantId?: string;
}

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  created_at: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ tenantId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchUsers = async () => {
    if (!tenantId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('breeder_profiles')
        .select('*')
        .eq('tenant_id', tenantId);
      
      if (fetchError) throw fetchError;
      
      if (data) {
        setUsers(data as User[]);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, [tenantId]);
  
  if (loading) {
    return <LoadingState message="Loading users..." />;
  }
  
  if (error) {
    return <ErrorState title="Error loading users" message={error} />;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Organization Members</h3>
        <Button>Invite User</Button>
      </div>
      
      {users.length === 0 ? (
        <div className="bg-muted/50 rounded-md p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No users found</h3>
          <p className="text-muted-foreground mb-4">
            There are no users in your organization yet.
          </p>
          <Button>Invite Your First User</Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profile_image_url || undefined} alt={`${user.first_name || ''} ${user.last_name || ''}`} />
                      <AvatarFallback>
                        {(user.first_name?.[0] || '') + (user.last_name?.[0] || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{`${user.first_name || ''} ${user.last_name || ''}`}</div>
                      {user.role === 'admin' && (
                        <div className="text-xs text-muted-foreground">Administrator</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role || 'User'}
                  </Badge>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UserManagement;
