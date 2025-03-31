
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAdminSetup = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isTenantAdmin, setIsTenantAdmin] = useState(false);
  const [tenantSettings, setTenantSettings] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUserPermissions();
  }, [user]);

  const checkUserPermissions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Check if the user is a tenant admin
      const { data: profileData, error: profileError } = await supabase
        .from('breeder_profiles')
        .select('role, tenant_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const isAdmin = profileData?.role === 'admin' || profileData?.role === 'owner';
      setIsTenantAdmin(isAdmin);

      // If admin, get tenant settings
      if (isAdmin && profileData.tenant_id) {
        try {
          // This section would load settings from a tenant_settings table if you have one
          // For now, we'll just set a placeholder
          setTenantSettings({
            id: profileData.tenant_id,
            name: 'Your Organization'
          });
        } catch (settingsError) {
          console.error('Error loading tenant settings:', settingsError);
        }
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to check your permissions.',
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
  };
};
