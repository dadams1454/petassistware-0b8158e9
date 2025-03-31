
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

      // If admin, get tenant settings from tenant_settings table or create if not exists
      if (isAdmin) {
        try {
          // Try to fetch existing tenant settings
          const { data: tenantData, error: tenantError } = await supabase
            .from('tenant_settings')
            .select('*')
            .eq('tenant_id', tenantId)
            .single();

          if (tenantError && tenantError.code !== 'PGRST116') { // Not-found error code
            console.error('Error fetching tenant settings:', tenantError);
            throw new Error('Unable to fetch organization settings');
          }

          if (tenantData) {
            // Use existing tenant settings
            setTenantSettings({
              id: tenantId,
              ...tenantData
            });
          } else {
            // Create default tenant settings
            const defaultSettings = {
              tenant_id: tenantId,
              name: 'Bear Paw Newfoundlands',
              description: 'Kennel Management System',
              contact_email: user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            // For now, just use the default settings without inserting into db
            // to prevent errors if the table doesn't exist yet
            setTenantSettings({
              id: tenantId,
              name: defaultSettings.name,
              description: defaultSettings.description,
              contactEmail: defaultSettings.contact_email,
              createdAt: defaultSettings.created_at
            });
          }
        } catch (settingsError: any) {
          console.error('Error loading tenant settings:', settingsError);
          
          // Use default settings even if there was an error
          setTenantSettings({
            id: tenantId,
            name: 'Bear Paw Newfoundlands',
            description: 'Kennel Management System',
            contactEmail: user.email,
            createdAt: new Date().toISOString()
          });
          
          // Still set the error so the user knows something went wrong
          setError('Could not load organization settings, using defaults instead');
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
