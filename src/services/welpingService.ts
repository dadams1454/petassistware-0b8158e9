
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Puppy } from '@/types/litter';

export interface WelpingRecord {
  id: string;
  litter_id: string;
  birth_date: string;
  start_time: string;
  end_time?: string;
  total_puppies: number;
  males: number;
  females: number;
  notes?: string;
  created_at: string;
  attended_by?: string;
  complications?: boolean;
  complication_notes?: string;
  status: 'in-progress' | 'completed';
}

export interface WelpingObservation {
  id: string;
  welping_record_id: string;
  puppy_id?: string;
  observation_time: string;
  observation_type: 'maternal' | 'puppy' | 'environment';
  description: string;
  action_taken?: string;
  created_at: string;
}

export interface WelpingPostpartumCare {
  id: string;
  puppy_id: string;
  care_time: string;
  care_type: 'feeding' | 'cleaning' | 'medical' | 'weighing' | 'other';
  notes: string;
  performed_by?: string;
  created_at: string;
}

export const createWelpingRecord = async (
  litterId: string,
  data: Omit<WelpingRecord, 'id' | 'created_at'>
): Promise<WelpingRecord | null> => {
  try {
    const { data: record, error } = await supabase
      .from('welping_records')
      .insert({
        litter_id: litterId,
        birth_date: data.birth_date,
        start_time: data.start_time,
        end_time: data.end_time,
        total_puppies: data.total_puppies,
        males: data.males,
        females: data.females,
        notes: data.notes,
        attended_by: data.attended_by,
        complications: data.complications,
        complication_notes: data.complication_notes,
        status: data.status
      })
      .select()
      .single();

    if (error) throw error;
    return record as WelpingRecord;
  } catch (error) {
    console.error('Error creating welping record:', error);
    toast({
      title: 'Error',
      description: 'Failed to create welping record',
      variant: 'destructive',
    });
    return null;
  }
};

export const updateWelpingRecord = async (
  recordId: string,
  data: Partial<WelpingRecord>
): Promise<WelpingRecord | null> => {
  try {
    const { data: record, error } = await supabase
      .from('welping_records')
      .update(data)
      .eq('id', recordId)
      .select()
      .single();

    if (error) throw error;
    return record as WelpingRecord;
  } catch (error) {
    console.error('Error updating welping record:', error);
    toast({
      title: 'Error',
      description: 'Failed to update welping record',
      variant: 'destructive',
    });
    return null;
  }
};

export const getWelpingRecordForLitter = async (
  litterId: string
): Promise<WelpingRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('welping_records')
      .select('*')
      .eq('litter_id', litterId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as WelpingRecord | null;
  } catch (error) {
    console.error('Error fetching welping record:', error);
    return null;
  }
};

export const addWelpingObservation = async (
  data: Omit<WelpingObservation, 'id' | 'created_at'>
): Promise<WelpingObservation | null> => {
  try {
    const { data: observation, error } = await supabase
      .from('welping_observations')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: 'Observation Recorded',
      description: 'Whelping observation has been saved successfully'
    });
    
    return observation as WelpingObservation;
  } catch (error) {
    console.error('Error adding welping observation:', error);
    toast({
      title: 'Error',
      description: 'Failed to record welping observation',
      variant: 'destructive',
    });
    return null;
  }
};

export const getWelpingObservations = async (
  welpingRecordId: string
): Promise<WelpingObservation[]> => {
  try {
    const { data, error } = await supabase
      .from('welping_observations')
      .select('*')
      .eq('welping_record_id', welpingRecordId)
      .order('observation_time', { ascending: false });

    if (error) throw error;
    return data as WelpingObservation[];
  } catch (error) {
    console.error('Error fetching welping observations:', error);
    return [];
  }
};

export const addPostpartumCare = async (
  data: Omit<WelpingPostpartumCare, 'id' | 'created_at'>
): Promise<WelpingPostpartumCare | null> => {
  try {
    const { data: care, error } = await supabase
      .from('welping_postpartum_care')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: 'Care Recorded',
      description: 'Postpartum care record has been saved successfully'
    });
    
    return care as WelpingPostpartumCare;
  } catch (error) {
    console.error('Error adding postpartum care:', error);
    toast({
      title: 'Error',
      description: 'Failed to record postpartum care',
      variant: 'destructive',
    });
    return null;
  }
};

export const getPostpartumCareForPuppy = async (
  puppyId: string
): Promise<WelpingPostpartumCare[]> => {
  try {
    const { data, error } = await supabase
      .from('welping_postpartum_care')
      .select('*')
      .eq('puppy_id', puppyId)
      .order('care_time', { ascending: false });

    if (error) throw error;
    return data as WelpingPostpartumCare[];
  } catch (error) {
    console.error('Error fetching postpartum care records:', error);
    return [];
  }
};

export const enhancedPuppyData = async (
  puppyId: string
): Promise<{
  puppy: Puppy | null;
  postpartumCare: WelpingPostpartumCare[];
  birthDetails: any | null;
}> => {
  try {
    // Get puppy data
    const { data: puppy, error: puppyError } = await supabase
      .from('puppies')
      .select(`
        *,
        litter:litters(*)
      `)
      .eq('id', puppyId)
      .single();
    
    if (puppyError) throw puppyError;
    
    // Get postpartum care data
    const postpartumCare = await getPostpartumCareForPuppy(puppyId);
    
    // Get birth details from welping_observations
    const { data: birthDetails, error: birthError } = await supabase
      .from('welping_observations')
      .select('*')
      .eq('puppy_id', puppyId)
      .eq('observation_type', 'puppy')
      .order('observation_time', { ascending: true })
      .limit(1)
      .maybeSingle();
    
    if (birthError) throw birthError;
    
    return {
      puppy: puppy as Puppy,
      postpartumCare,
      birthDetails
    };
  } catch (error) {
    console.error('Error fetching enhanced puppy data:', error);
    return {
      puppy: null,
      postpartumCare: [],
      birthDetails: null
    };
  }
};
