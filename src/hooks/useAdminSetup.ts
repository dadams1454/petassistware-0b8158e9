
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAdminSetup = () => {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isTenantAdmin, setIsTenantAdmin] = useState(false);
  const [tenantSettings, setTenantSettings] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUserPermissions();
  }, [user, userRole]);

  const checkUserPermissions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setError(null); // Clear any previous errors
    
    try {
      // Check if the user is a tenant admin based on userRole from auth context
      const isAdmin = userRole === 'admin' || userRole === 'owner';
      setIsTenantAdmin(isAdmin);
      
      // Get tenant id from the profile
      const { data: profileData, error: profileError } = await supabase
        .from('breeder_profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching tenant ID:', profileError);
        throw new Error('Unable to verify your organization settings');
      }

      // If admin, get tenant settings
      if (isAdmin && profileData?.tenant_id) {
        try {
          // For now, we'll just set a placeholder with the tenant ID
          setTenantSettings({
            id: profileData.tenant_id,
            name: 'Your Organization'
          });
        } catch (settingsError: any) {
          console.error('Error loading tenant settings:', settingsError);
          throw new Error('Error loading organization settings');
        }
      } else if (isAdmin && !profileData?.tenant_id) {
        // Admin without tenant ID
        setTenantSettings({
          id: null,
          name: 'Organization Not Configured'
        });
      }
    } catch (error: any) {
      console.error('Error in admin setup:', error);
      setError(error.message || 'An error occurred while loading admin settings');
      toast({
        title: 'Error',
        description: error.message || 'Failed to load admin settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isTenantAdmin,
    tenantSettings,
    error,
  };
};
