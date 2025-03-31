
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAdminSetup = () => {
  const { user, userRole, tenantId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isTenantAdmin, setIsTenantAdmin] = useState(false);
  const [tenantSettings, setTenantSettings] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUserPermissions();
  }, [user, userRole, tenantId]);

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
      
      // If there's no tenant ID, create default settings
      if (!tenantId) {
        console.log('No tenant ID found, using default settings');
        setTenantSettings({
          id: null,
          name: 'Bear Paw Newfoundlands',
          description: 'Kennel Management System',
          contactEmail: user.email,
          createdAt: new Date().toISOString()
        });
        setLoading(false);
        return;
      }

      // If admin, try to get tenant settings
      if (isAdmin) {
        try {
          // Check if tenant_settings table exists by querying the database schema
          // We'll use a different approach that doesn't rely on the tenant_settings table
          
          // For now, just use default settings
          setTenantSettings({
            id: tenantId,
            name: 'Bear Paw Newfoundlands',
            description: 'Kennel Management System',
            contactEmail: user.email,
            createdAt: new Date().toISOString()
          });
          
          // We can optionally check for a tenant record in breeder_profiles
          const { data: tenantData, error: tenantError } = await supabase
            .from('breeder_profiles')
            .select('*')
            .eq('tenant_id', tenantId)
            .maybeSingle();

          if (tenantError && tenantError.code !== 'PGRST116') { // Not-found error code
            console.error('Error fetching tenant profile:', tenantError);
            // Don't throw, we'll use the default settings
          }

          if (tenantData) {
            // Enhance settings with data from breeder_profiles if available
            setTenantSettings(prev => ({
              ...prev,
              businessName: tenantData.business_name,
              contactEmail: tenantData.email || prev.contactEmail,
            }));
          }
        } catch (settingsError: any) {
          console.error('Error loading tenant settings:', settingsError);
          
          // Continue using the default settings we already set
          setError('Could not load complete organization settings, using defaults instead');
        }
      } else {
        setTenantSettings(null);
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
