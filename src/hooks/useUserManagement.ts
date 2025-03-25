
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { UserWithProfile } from '@/types/user';

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
      
      const { data, error: profilesError } = await supabase
        .from('breeder_profiles')
        .select('*')
        .eq('tenant_id', tenantId);
      
      if (profilesError) throw profilesError;
      
      if (data) {
        // Map the profile data to our UserWithProfile type
        const formattedUsers = data.map((profile: any) => ({
          id: profile.id,
          email: profile.email,
          created_at: profile.created_at,
          last_sign_in_at: null,
          first_name: profile.first_name,
          last_name: profile.last_name,
          profile_image_url: profile.profile_image_url,
          role: profile.role,
          tenant_id: profile.tenant_id || tenantId
        })) as UserWithProfile[];
        
        setUsers(formattedUsers);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
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
    userRole
  };
};
