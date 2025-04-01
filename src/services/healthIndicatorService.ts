
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: string | null;
  energy: string | null;
  stool_consistency: string | null;
  abnormal: boolean;
  notes: string | null;
  created_at: string;
  created_by: string | null;
  alert_generated: boolean;
}

export interface HealthIndicatorFormValues {
  dog_id: string;
  date: string;
  appetite: string | null;
  energy: string | null;
  stool_consistency: string | null;
  abnormal: boolean;
  notes: string | null;
}

// Get health indicators for a specific dog
export const getHealthIndicatorsForDog = async (dogId: string): Promise<HealthIndicator[]> => {
  try {
    const { data, error } = await supabase
      .from('health_indicators')
      .select('*')
      .eq('dog_id', dogId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data as HealthIndicator[];
  } catch (error) {
    console.error('Error fetching health indicators:', error);
    return [];
  }
};

// Add a new health indicator
export const addHealthIndicator = async (
  values: HealthIndicatorFormValues,
  userId: string | undefined
): Promise<{ success: boolean; data?: HealthIndicator; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('health_indicators')
      .insert({
        ...values,
        created_by: userId
      })
      .select();

    if (error) throw error;
    
    // Check if data exists and has at least one element
    if (data && data.length > 0) {
      const newIndicator = data[0] as HealthIndicator;
      
      // Check if the indicator is abnormal and create an alert if needed
      if (values.abnormal) {
        await createHealthAlert(newIndicator.id);
      }
      
      return { success: true, data: newIndicator };
    } else {
      throw new Error('No data returned after insertion');
    }
  } catch (error) {
    console.error('Error adding health indicator:', error);
    let errorMessage = 'Failed to add health indicator';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
    
    return { success: false, error: errorMessage };
  }
};

// Create a health alert for an abnormal indicator
const createHealthAlert = async (indicatorId: string): Promise<void> => {
  try {
    const { data: indicator, error: indicatorError } = await supabase
      .from('health_indicators')
      .select('dog_id')
      .eq('id', indicatorId)
      .single();

    if (indicatorError) throw indicatorError;
    if (!indicator) throw new Error('Indicator not found');

    // Create the alert
    await supabase
      .from('health_alerts')
      .insert({
        dog_id: indicator.dog_id,
        indicator_id: indicatorId,
        status: 'active'
      });

    // Update the indicator to mark that an alert was generated
    await supabase
      .from('health_indicators')
      .update({ alert_generated: true })
      .eq('id', indicatorId);
  } catch (error) {
    console.error('Error creating health alert:', error);
  }
};
