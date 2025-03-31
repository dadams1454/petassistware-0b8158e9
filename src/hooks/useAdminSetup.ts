
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { isValidUUID } from '@/utils/uuidUtils';

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
      
      // Default settings as fallback
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
      
      // If there's no tenant ID, use default settings but mark as not setup
      if (!tenantId) {
        console.log('No tenant ID found, organization needs setup');
        setTenantSettings({
          ...defaultSettings,
          needsSetup: true
        });
        setLoading(false);
        return;
      }

      // Check if the tenant ID is a valid UUID
      if (tenantId && !isValidUUID(tenantId)) {
        console.warn('Invalid UUID format for tenant ID:', tenantId);
        setError(`Invalid UUID format for tenant ID: ${tenantId}`);
        setTenantSettings({
          ...defaultSettings,
          id: tenantId,
          needsSetup: true
        });
        setLoading(false);
        return;
      }

      // Try to get tenant settings from breeder_profiles table
      const { data: tenantData, error: tenantError } = await supabase
        .from('breeder_profiles')
        .select('*')
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (tenantError) {
        console.warn('Could not fetch from breeder_profiles:', tenantError);
        throw tenantError;
      }

      if (tenantData) {
        // Use the data from breeder_profiles
        setTenantSettings({
          id: tenantId,
          name: tenantData.business_name || defaultSettings.name,
          description: tenantData.business_overview || defaultSettings.description,
          contactEmail: tenantData.email || defaultSettings.contactEmail,
          createdAt: tenantData.created_at || defaultSettings.createdAt
        });
      } else {
        // No existing profile found, use default settings but mark as needing setup
        setTenantSettings({
          ...defaultSettings,
          needsSetup: true
        });
      }
    } catch (error: any) {
      console.error('Error in admin setup:', error);
      setError(`Failed to load organization settings: ${error.message}`);
      
      // Still set default settings to ensure UI works
      setTenantSettings({
        id: tenantId || null,
        name: 'Bear Paw Newfoundlands',
        description: 'Kennel Management System',
        contactEmail: user?.email || 'admin@example.com',
        createdAt: new Date().toISOString(),
        needsSetup: true
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
    reloadSettings: checkUserPermissions
  };
};
