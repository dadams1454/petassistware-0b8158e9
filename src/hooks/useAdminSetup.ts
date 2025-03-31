
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
      
      // Create default settings that will always work
      const defaultSettings = {
        id: tenantId || null,
        name: 'Bear Paw Newfoundlands',
        description: 'Kennel Management System',
        contactEmail: user.email,
        businessName: 'Bear Paw Newfoundlands',
        createdAt: new Date().toISOString()
      };
      
      // If not admin, don't try to load settings
      if (!isAdmin) {
        setTenantSettings(null);
        setLoading(false);
        return;
      }
      
      // If there's no tenant ID, use default settings
      if (!tenantId) {
        console.log('No tenant ID found, using default settings');
        setTenantSettings(defaultSettings);
        setLoading(false);
        return;
      }

      // Try to get tenant settings from breeder_profiles table
      try {
        const { data: tenantData, error: tenantError } = await supabase
          .from('breeder_profiles')
          .select('*')
          .eq('tenant_id', tenantId)
          .maybeSingle();

        if (tenantError) {
          console.warn('Could not fetch from breeder_profiles:', tenantError);
          // Don't throw, we'll use the default settings
        }

        if (tenantData) {
          // Enhance default settings with data from breeder_profiles if available
          setTenantSettings({
            ...defaultSettings,
            businessName: tenantData.business_name || defaultSettings.businessName,
            contactEmail: tenantData.email || defaultSettings.contactEmail,
            name: tenantData.business_name || defaultSettings.name,
          });
        } else {
          // Just use the default settings
          setTenantSettings(defaultSettings);
        }
      } catch (settingsError: any) {
        console.warn('Error loading tenant settings:', settingsError);
        // Still set the default settings to ensure UI works
        setTenantSettings(defaultSettings);
        setError('Could not connect to database. Using default settings instead.');
      }
    } catch (error: any) {
      console.error('Error in admin setup:', error);
      // Set default settings even on error to ensure the UI renders
      setTenantSettings({
        id: tenantId || null,
        name: 'Bear Paw Newfoundlands',
        description: 'Kennel Management System',
        contactEmail: user?.email || 'admin@example.com',
        createdAt: new Date().toISOString()
      });
      setError('Encountered an error, using default settings.');
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
