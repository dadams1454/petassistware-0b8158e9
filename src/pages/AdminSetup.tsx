
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, UserCog, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminSetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all profiles to see if we have any users and check for admins
      const { data, error } = await supabase
        .from('breeder_profiles')
        .select('*');
        
      if (error) throw error;
      
      setUsers(data || []);
      
      // Check if we already have any admin users
      const adminUsers = data?.filter(user => user.role === 'admin') || [];
      if (adminUsers.length > 0) {
        setAdminEmail(adminUsers[0].email);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateAdmin = async () => {
    try {
      setProcessing(true);
      setError(null);
      setSuccess(false);
      
      if (!adminEmail) {
        throw new Error('Please enter an email address');
      }
      
      // Check if the email exists in our profiles
      const { data: profileData, error: profileError } = await supabase
        .from('breeder_profiles')
        .select('*')
        .eq('email', adminEmail)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      if (profileData) {
        // Update existing user to admin role
        const { error: updateError } = await supabase
          .from('breeder_profiles')
          .update({ role: 'admin' })
          .eq('id', profileData.id);
          
        if (updateError) throw updateError;
        
        setSuccess(true);
        toast({
          title: "Admin role assigned",
          description: `${adminEmail} has been updated to admin role. You can now log in with this account.`,
        });
      } else {
        // Create a new profile with admin role (for testing only)
        const { data: newUser, error: userError } = await supabase.auth.signUp({
          email: adminEmail,
          password: 'Password123!', // Default password for testing
        });
        
        if (userError) throw userError;
        
        // The trigger should create the profile, but we'll update it to have admin role
        if (newUser.user) {
          // Wait a moment for the profile to be created by the trigger
          setTimeout(async () => {
            const { error: updateError } = await supabase
              .from('breeder_profiles')
              .update({ 
                role: 'admin',
                first_name: 'Admin',
                last_name: 'User',
                tenant_id: newUser.user?.id
              })
              .eq('id', newUser.user?.id);
              
            if (updateError) {
              console.error('Error updating new user to admin:', updateError);
              toast({
                title: "Partial success",
                description: `User created but role update failed. Please try updating the role manually.`,
                variant: "destructive"
              });
            } else {
              setSuccess(true);
              toast({
                title: "Admin account created",
                description: `Admin account created with email ${adminEmail}. Default password: Password123!`,
              });
            }
          }, 1000);
        }
      }
      
      await fetchUsers(); // Refresh the list
    } catch (err: any) {
      console.error('Error creating admin:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const handlePromoteToAdmin = async (userId: string, email: string) => {
    try {
      setProcessing(true);
      setError(null);
      
      // Update the user to have admin role
      const { error: updateError } = await supabase
        .from('breeder_profiles')
        .update({ 
          role: 'admin',
          tenant_id: userId // Set the tenant_id to make them self-contained
        })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Admin role assigned",
        description: `${email} has been updated to admin role.`,
      });
      
      await fetchUsers(); // Refresh the list
    } catch (err: any) {
      console.error('Error promoting to admin:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };
  
  if (loading) {
    return <LoadingState message="Loading user data..." />;
  }
  
  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Admin Account Setup"
        subtitle="Set up administrator access for your application"
        backLink="/dashboard"
      />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Administrator Access</CardTitle>
          <CardDescription>
            Create or assign admin privileges to user accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Admin account has been set up successfully.</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="admin-email">Email for admin access</Label>
              <div className="flex mt-1 gap-2">
                <Input
                  id="admin-email"
                  placeholder="admin@example.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
                <Button 
                  onClick={handleCreateAdmin} 
                  disabled={processing || !adminEmail}
                >
                  {processing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UserCog className="h-4 w-4 mr-2" />}
                  {processing ? 'Processing...' : 'Set as Admin'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                If the email doesn't exist, a new user will be created with a default password: <span className="font-mono">Password123!</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {users.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Existing Users</CardTitle>
            <CardDescription>
              Promote existing users to admin role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Admin
                          </span>
                        ) : (
                          <span>{user.role || 'No role'}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {user.role !== 'admin' && (
                          <Button
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePromoteToAdmin(user.id, user.email)}
                            disabled={processing}
                          >
                            Make Admin
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={fetchUsers} disabled={processing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh List
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AdminSetup;
