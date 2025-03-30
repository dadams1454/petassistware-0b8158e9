
import { supabase } from '@/integrations/supabase/client';

export const auditLogger = {
  logEvent: async (
    action: string,
    entityType: string,
    entityId: string,
    notes?: string,
    previousState?: any,
    newState?: any
  ) => {
    try {
      // Use the RPC function we created in the database
      const { data, error } = await supabase.rpc('log_audit_event', {
        action,
        entity_type: entityType,
        entity_id: entityId,
        previous_state: previousState ? previousState : null,
        new_state: newState ? newState : null,
        notes: notes || null
      });
      
      if (error) {
        console.error('Error logging audit event:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Exception when logging audit event:', err);
      return false;
    }
  },
  
  // Helper functions for common operations
  logUserAction: async (userId: string, action: string, details: string) => {
    return auditLogger.logEvent(
      'USER_ACTION',
      'user_actions',
      userId,
      details
    );
  },
  
  logBusinessEvent: async (
    eventType: string,
    entityType: string,
    entityId: string,
    details: string,
    data?: any
  ) => {
    return auditLogger.logEvent(
      eventType,
      entityType,
      entityId,
      details,
      null,
      data
    );
  },
  
  logImportantChange: async (
    entityType: string,
    entityId: string,
    description: string,
    oldValue: any,
    newValue: any
  ) => {
    return auditLogger.logEvent(
      'IMPORTANT_CHANGE',
      entityType,
      entityId,
      description,
      oldValue,
      newValue
    );
  }
};
