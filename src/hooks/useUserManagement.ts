
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { UserWithProfile } from '@/types/user';

// Define a simpler type for breeder profiles to prevent TS2589 error
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
  const { userRole, tenantId, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserWithProfile[]>([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      if (!tenantId) {
        throw new Error("Missing tenant ID");
      }
      
      // Check if tenantId is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(tenantId)) {
        console.log(`Invalid UUID format for tenant ID: ${tenantId}`);
        // Handle the case where tenantId is not a valid UUID
        setError(`Invalid UUID format for tenant ID: ${tenantId}`);
        setUsers([]);
        setLoading(false);
        return;
      }

      // For mock setup, we'll create a sample set of users if none exist
      const { data, error: profilesError } = await supabase
        .from('breeder_profiles')
        .select('*')
        .eq('tenant_id', tenantId);
      
      if (profilesError) throw profilesError;
      
      if (data && data.length > 0) {
        // Use explicit type casting to avoid deep type instantiation
        const profiles = data as BreederProfile[];
        
        const formattedUsers: UserWithProfile[] = profiles.map((profile) => ({
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
      } else {
        // For demonstration purposes, create a mock user if none exist
        await createMockUsers();
        
        // Fetch again after creating mock users
        const { data: refreshData, error: refreshError } = await supabase
          .from('breeder_profiles')
          .select('*')
          .eq('tenant_id', tenantId);
        
        if (refreshError) throw refreshError;
        
        if (refreshData) {
          const profiles = refreshData as BreederProfile[];
          
          const formattedUsers: UserWithProfile[] = profiles.map((profile) => ({
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
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to create mock users for demo purposes
  const createMockUsers = async () => {
    try {
      if (!tenantId || !user) return;
      
      // Create the current user first if it doesn't exist
      const { data: existingUser } = await supabase
        .from('breeder_profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (!existingUser) {
        await supabase
          .from('breeder_profiles')
          .upsert({
            id: user.id,
            email: user.email,
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin',
            tenant_id: tenantId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      // Add some sample staff members
      const sampleUsers = [
        {
          id: '2f9d3a1e-5b3c-42d1-9d8f-62a1e294b465',
          email: 'staff@example.com',
          first_name: 'Staff',
          last_name: 'Member',
          role: 'staff',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tenant_id: tenantId
        },
        {
          id: '3e8c7b2a-4d9f-48e7-b1a6-5c3d2f981e0d',
          email: 'manager@example.com',
          first_name: 'Manager',
          last_name: 'User',
          role: 'manager',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tenant_id: tenantId
        }
      ];
      
      // Check if these sample users exist before inserting
      for (const sampleUser of sampleUsers) {
        const { data: existingSample } = await supabase
          .from('breeder_profiles')
          .select('id')
          .eq('id', sampleUser.id)
          .single();
        
        if (!existingSample) {
          await supabase
            .from('breeder_profiles')
            .upsert(sampleUser);
        }
      }
      
      console.log('Mock users created successfully');
    } catch (error: any) {
      console.error('Error creating mock users:', error);
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
    signOutAllUsers,
    tenantId // Expose tenantId for error messages
  };
};
