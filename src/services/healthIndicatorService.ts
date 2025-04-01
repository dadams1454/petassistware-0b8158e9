
import { supabase, customSupabase } from '@/integrations/supabase/client';
import { 
  HealthIndicatorRecord, 
  AppetiteLevelEnum, 
  EnergyLevelEnum, 
  StoolConsistencyEnum,
  adaptHealthIndicatorRecord
} from '@/types/health';

// Fetch health indicators for a dog
export const getHealthIndicators = async (dogId: string): Promise<HealthIndicatorRecord[]> => {
  const { data, error } = await customSupabase
    .from('health_indicators')
    .select('*')
    .eq('dog_id', dogId)
    .order('date', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(record => adaptHealthIndicatorRecord(record));
};

// Add a health indicator record
export const addHealthIndicator = async (record: Omit<HealthIndicatorRecord, 'id' | 'created_at'>): Promise<HealthIndicatorRecord> => {
  // Determine if the record is abnormal based on indicator values
  const abnormal = isAbnormalHealthIndicator(record);

  const { data, error } = await customSupabase
    .from('health_indicators')
    .insert([
      {
        dog_id: record.dog_id,
        date: record.date,
        appetite: record.appetite,
        energy: record.energy,
        stool_consistency: record.stool_consistency,
        notes: record.notes,
        created_by: record.created_by,
        abnormal,
        alert_generated: abnormal // Auto-generate alert if abnormal
      }
    ])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to insert health indicator record');
  
  // If abnormal, create an alert
  if (abnormal && data) {  // Double-check that data is not null
    try {
      // TypeScript-safe access to data.id
      const dataId = data.id;
      if (dataId) {
        await createHealthAlert(dataId.toString(), record.dog_id);
      } else {
        console.error('Data object does not have a valid id property:', data);
      }
    } catch (alertError) {
      console.error('Failed to create health alert:', alertError);
      // Continue without failing the whole operation
    }
  }
  
  return adaptHealthIndicatorRecord(data);
};

// Update a health indicator record
export const updateHealthIndicator = async (id: string, updates: Partial<HealthIndicatorRecord>): Promise<HealthIndicatorRecord> => {
  const { data, error } = await customSupabase
    .from('health_indicators')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to update health indicator record');
  
  return adaptHealthIndicatorRecord(data);
};

// Delete a health indicator record
export const deleteHealthIndicator = async (id: string): Promise<void> => {
  const { error } = await customSupabase
    .from('health_indicators')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Get recent health indicators
export const getRecentHealthIndicators = async (dogId: string, days = 7): Promise<HealthIndicatorRecord[]> => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  
  const { data, error } = await customSupabase
    .from('health_indicators')
    .select('*')
    .eq('dog_id', dogId)
    .gte('date', date.toISOString().split('T')[0])
    .order('date', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(record => adaptHealthIndicatorRecord(record));
};

// Get abnormal health indicators
export const getAbnormalHealthIndicators = async (dogId: string): Promise<HealthIndicatorRecord[]> => {
  const { data, error } = await customSupabase
    .from('health_indicators')
    .select('*')
    .eq('dog_id', dogId)
    .eq('abnormal', true)
    .order('date', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(record => adaptHealthIndicatorRecord(record));
};

// Create a health alert
export const createHealthAlert = async (indicatorId: string, dogId: string): Promise<void> => {
  const { error } = await customSupabase
    .from('health_alerts')
    .insert([
      {
        indicator_id: indicatorId,
        dog_id: dogId,
        status: 'active',
        resolved: false
      }
    ]);

  if (error) throw error;
};

// Check if health indicator is abnormal
export const isAbnormalHealthIndicator = (record: Partial<HealthIndicatorRecord>): boolean => {
  // Logic to determine if a health indicator is abnormal
  const appetiteAbnormal = record.appetite && 
    [AppetiteLevelEnum.Poor, AppetiteLevelEnum.None].includes(record.appetite);
  
  const energyAbnormal = record.energy && 
    [EnergyLevelEnum.Low, EnergyLevelEnum.VeryLow].includes(record.energy);
  
  const stoolAbnormal = record.stool_consistency && 
    [StoolConsistencyEnum.Loose, StoolConsistencyEnum.Watery, 
     StoolConsistencyEnum.Bloody, StoolConsistencyEnum.Mucousy].includes(record.stool_consistency);
  
  return appetiteAbnormal || energyAbnormal || stoolAbnormal;
};

// Get all health alerts for a dog
export const getHealthAlerts = async (dogId: string, includeResolved = false): Promise<any[]> => {
  let query = customSupabase
    .from('health_alerts')
    .select('*, health_indicators(*)')
    .eq('dog_id', dogId);
  
  if (!includeResolved) {
    query = query.eq('resolved', false);
  }
  
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  return data || [];
};

// Resolve a health alert
export const resolveHealthAlert = async (alertId: string): Promise<void> => {
  const { error } = await customSupabase
    .from('health_alerts')
    .update({ resolved: true, status: 'resolved', resolved_at: new Date().toISOString() })
    .eq('id', alertId);

  if (error) throw error;
};
