
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserWithProfile } from '@/types/user';
import { BreederProfile } from './types';
import { createMockUsers } from './createMockUsers';
import { isValidUUID } from '@/utils/uuidUtils';

export const useFetchUsers = (tenantId: string | null, user: any) => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!tenantId) {
        throw new Error("Missing tenant ID");
      }
      
      // Check if tenantId is a valid UUID
      if (!isValidUUID(tenantId)) {
        console.log(`Invalid UUID format for tenant ID: ${tenantId}`);
        setError(`Invalid UUID format for tenant ID: ${tenantId}`);
        setUsers([]);
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
        await createMockUsers(tenantId, user);
        
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

  return {
    users,
    loading,
    error,
    fetchUsers
  };
};
