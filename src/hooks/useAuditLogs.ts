import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';

export type AuditLogEntry = {
  id: string;
  user_id: string;
  timestamp: string;
  action: string;
  entity_type: string;
  entity_id: string;
  previous_state: any;
  new_state: any;
  formatted_message?: string;
  user_name?: string;
};

export type AuditLogFilters = {
  entity_type?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  searchTerm?: string;
};

export const useAuditLogs = (filters: AuditLogFilters = {}, limit = 50) => {
  const { toast } = useToast();
  const { tenantId } = useAuth();
  const [page, setPage] = useState(1);
  
  const fetchAuditLogs = async () => {
    try {
      if (!tenantId) {
        throw new Error('No tenant ID available');
      }

      // Simple query without join - we'll handle the user name separately
      let query = supabase
        .from('audit_logs')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('timestamp', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      // Apply filters
      if (filters.entity_type) {
        query = query.eq('entity_type', filters.entity_type);
      }
      
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.startDate) {
        query = query.gte('timestamp', filters.startDate.toISOString());
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        query = query.lte('timestamp', endDate.toISOString());
      }
      
      if (filters.searchTerm) {
        // This is a simplistic approach - in production you might want 
        // to use a more sophisticated search mechanism
        query = query.or(`entity_type.ilike.%${filters.searchTerm}%,notes.ilike.%${filters.searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // If we have data, fetch user profiles separately for each user_id
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(log => log.user_id))].filter(Boolean);
        
        // Only fetch user profiles if we have valid user IDs
        if (userIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('breeder_profiles')
            .select('id, first_name, last_name, email')
            .in('id', userIds);
          
          if (profilesError) {
            console.error('Error fetching user profiles:', profilesError);
          } else if (profiles) {
            // Create a map of user_id to user details
            const userMap = profiles.reduce((acc, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {});
            
            // Add user name to each log entry
            return data.map((log: any) => {
              const userData = log.user_id ? userMap[log.user_id] : null;
              return {
                ...log,
                user_name: userData ? 
                  (userData.first_name && userData.last_name ? 
                    `${userData.first_name} ${userData.last_name}` : 
                    userData.email) : 
                  'Unknown User',
              };
            });
          }
        }
      }

      // Return the basic log data if we can't add user names
      return data.map((log: any) => ({
        ...log,
        user_name: 'Unknown User'
      }));
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: 'Error fetching audit logs',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }
  };

  const { data: auditLogs = [], isLoading, error, refetch } = useQuery({
    queryKey: ['auditLogs', tenantId, page, limit, filters],
    queryFn: fetchAuditLogs,
    enabled: !!tenantId,
  });

  return {
    auditLogs,
    isLoading,
    error,
    refetch,
    page,
    setPage,
  };
};

export const useAuditLogTypes = () => {
  const { tenantId } = useAuth();
  
  const fetchEntityTypes = async () => {
    try {
      if (!tenantId) return [];
      
      // Use a select query with a GROUP BY instead of distinct
      const { data, error } = await supabase
        .from('audit_logs')
        .select('entity_type')
        .eq('tenant_id', tenantId);
        
      if (error) throw error;
      
      // Manual deduplication
      const uniqueTypes = [...new Set(data.map(item => item.entity_type))];
      return uniqueTypes.sort();
    } catch (error) {
      console.error('Error fetching entity types:', error);
      return [];
    }
  };
  
  const { data: entityTypes = [] } = useQuery({
    queryKey: ['auditLogEntityTypes', tenantId],
    queryFn: fetchEntityTypes,
    enabled: !!tenantId,
  });
  
  const actionTypes = ['INSERT', 'UPDATE', 'DELETE'];
  
  return { entityTypes, actionTypes };
};

export const useManualAuditLog = () => {
  const { toast } = useToast();
  
  const logAction = async (
    action: string,
    entityType: string,
    entityId: string,
    notes?: string,
    previousState?: any,
    newState?: any
  ) => {
    try {
      const { data, error } = await supabase.rpc('log_audit_event', {
        action,
        entity_type: entityType,
        entity_id: entityId,
        previous_state: previousState,
        new_state: newState,
        notes
      });
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error logging action:', error);
      toast({
        title: 'Error logging action',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };
  
  return { logAction };
};
