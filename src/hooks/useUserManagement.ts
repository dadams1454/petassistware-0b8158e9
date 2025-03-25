
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { UserWithProfile } from '@/types/user';

// Define the database profile type to match what comes from Supabase
type BreederProfile = {
  id: string;
  email: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  profile_image_url: string | null;
  role: string | null;
  business_name?: string | null;
  business_overview?: string | null;
  business_details?: string | null;
  breeding_experience?: string | null;
  updated_at: string;
  tenant_id?: string | null;
};

export const useUserManagement = () => {
  const { userRole, tenantId } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserWithProfile[]>([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      if (!tenantId) {
        throw new Error("Missing tenant ID");
      }
      
      // Define the return type using a non-generic approach
      const { data, error: profilesError } = await supabase
        .from('breeder_profiles')
        .select('*')
        .eq('tenant_id', tenantId);
      
      if (profilesError) throw profilesError;
      
      if (data) {
        // Use a simpler type assertion instead of complex inference
        const typedData = data as any[];
        
        // Map the profile data to our UserWithProfile type
        const formattedUsers: UserWithProfile[] = typedData.map((profile) => ({
          id: profile.id,
          email: profile.email,
          created_at: profile.created_at,
          last_sign_in_at: null,
          first_name: profile.first_name,
          last_name: profile.last_name,
          profile_image_url: profile.profile_image_url,
          role: profile.role,
          tenant_id: tenantId
        }));
        
        setUsers(formattedUsers);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to sign out all users
  const signOutAllUsers = async () => {
    try {
      setLoading(true);
      
      // Sign out the current user using Supabase auth
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) throw signOutError;
      
      toast({
        title: "Success",
        description: "You have been signed out. You will be redirected to the login page.",
        variant: "default"
      });
      
      // Redirect to auth page after a short delay
      setTimeout(() => {
        window.location.href = '/auth';
      }, 1500);
      
    } catch (err: any) {
      console.error('Error signing out users:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to sign out: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchUsers();
    }
  }, [tenantId]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    userRole,
    signOutAllUsers
  };
};
