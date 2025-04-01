
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

// Mock function for getting welping record for a litter
export const getWelpingRecordForLitter = async (
  litterId: string
): Promise<WelpingRecord | null> => {
  try {
    // For now, we'll return mock data since the real tables don't exist in Supabase yet
    const mockRecord: WelpingRecord = {
      id: `welp-${litterId}`,
      litter_id: litterId,
      birth_date: new Date().toISOString().split('T')[0],
      start_time: '08:30:00',
      end_time: '14:45:00',
      total_puppies: 6,
      males: 4,
      females: 2,
      notes: 'All puppies healthy, no complications.',
      created_at: new Date().toISOString(),
      attended_by: 'Dr. Smith',
      complications: false,
      status: 'completed'
    };
    
    return mockRecord;
  } catch (error) {
    console.error('Error fetching welping record:', error);
    return null;
  }
};

// Mock function for creating a welping record
export const createWelpingRecord = async (
  litterId: string,
  data: Omit<WelpingRecord, 'id' | 'created_at'>
): Promise<WelpingRecord | null> => {
  try {
    // For now, we'll return mock data since the real tables don't exist in Supabase yet
    const mockRecord: WelpingRecord = {
      id: `welp-${Math.random().toString(36).substring(2, 9)}`,
      ...data,
      litter_id: litterId,
      created_at: new Date().toISOString(),
    };

    toast({
      title: 'Success',
      description: 'Welping record created successfully',
    });
    
    return mockRecord;
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

// Mock function for updating a welping record
export const updateWelpingRecord = async (
  recordId: string,
  data: Partial<WelpingRecord>
): Promise<WelpingRecord | null> => {
  try {
    // For now, we'll return mock data since the real tables don't exist in Supabase yet
    const mockRecord: WelpingRecord = {
      id: recordId,
      litter_id: data.litter_id || 'unknown',
      birth_date: data.birth_date || new Date().toISOString().split('T')[0],
      start_time: data.start_time || '00:00:00',
      end_time: data.end_time,
      total_puppies: data.total_puppies || 0,
      males: data.males || 0,
      females: data.females || 0,
      notes: data.notes,
      created_at: new Date().toISOString(),
      attended_by: data.attended_by,
      complications: data.complications || false,
      complication_notes: data.complication_notes,
      status: data.status || 'in-progress',
    };

    toast({
      title: 'Success',
      description: 'Welping record updated successfully',
    });
    
    return mockRecord;
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

// Mock function for adding a welping observation
export const addWelpingObservation = async (
  data: Omit<WelpingObservation, 'id' | 'created_at'>
): Promise<WelpingObservation | null> => {
  try {
    // For now, we'll return mock data since the real tables don't exist in Supabase yet
    const mockObservation: WelpingObservation = {
      id: `obs-${Math.random().toString(36).substring(2, 9)}`,
      ...data,
      created_at: new Date().toISOString(),
    };
    
    toast({
      title: 'Observation Recorded',
      description: 'Whelping observation has been saved successfully'
    });
    
    return mockObservation;
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

// Mock function for getting welping observations
export const getWelpingObservations = async (
  welpingRecordId: string
): Promise<WelpingObservation[]> => {
  try {
    // For now, we'll return mock data since the real tables don't exist in Supabase yet
    const mockObservations: WelpingObservation[] = Array(3).fill(null).map((_, index) => ({
      id: `obs-${index}`,
      welping_record_id: welpingRecordId,
      puppy_id: index % 2 === 0 ? `puppy-${index}` : undefined,
      observation_time: new Date().toISOString(),
      observation_type: index % 3 === 0 ? 'maternal' : index % 3 === 1 ? 'puppy' : 'environment',
      description: `Observation ${index + 1}`,
      action_taken: index % 2 === 0 ? `Action ${index + 1}` : undefined,
      created_at: new Date().toISOString(),
    }));
    
    return mockObservations;
  } catch (error) {
    console.error('Error fetching welping observations:', error);
    return [];
  }
};

// Mock function for adding postpartum care
export const addPostpartumCare = async (
  data: Omit<WelpingPostpartumCare, 'id' | 'created_at'>
): Promise<WelpingPostpartumCare | null> => {
  try {
    // For now, we'll return mock data since the real tables don't exist in Supabase yet
    const mockCare: WelpingPostpartumCare = {
      id: `care-${Math.random().toString(36).substring(2, 9)}`,
      ...data,
      created_at: new Date().toISOString(),
    };
    
    toast({
      title: 'Care Recorded',
      description: 'Postpartum care record has been saved successfully'
    });
    
    return mockCare;
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

// Mock function for getting postpartum care for a puppy
export const getPostpartumCareForPuppy = async (
  puppyId: string
): Promise<WelpingPostpartumCare[]> => {
  try {
    // For now, we'll return mock data since the real tables don't exist in Supabase yet
    const mockCare: WelpingPostpartumCare[] = Array(5).fill(null).map((_, index) => ({
      id: `care-${index}`,
      puppy_id: puppyId,
      care_time: new Date().toISOString(),
      care_type: index % 5 === 0 ? 'feeding' : index % 5 === 1 ? 'cleaning' : 
                index % 5 === 2 ? 'medical' : index % 5 === 3 ? 'weighing' : 'other',
      notes: `Care note ${index + 1}`,
      performed_by: `Staff ${index % 3 + 1}`,
      created_at: new Date().toISOString(),
    }));
    
    return mockCare;
  } catch (error) {
    console.error('Error fetching postpartum care records:', error);
    return [];
  }
};

// Mock function for enhanced puppy data
export const enhancedPuppyData = async (
  puppyId: string
): Promise<{
  puppy: Puppy | null;
  postpartumCare: WelpingPostpartumCare[];
  birthDetails: any | null;
}> => {
  try {
    // Mock puppy data
    const mockPuppy: Puppy = {
      id: puppyId,
      name: `Puppy ${puppyId.slice(-2)}`,
      litter_id: 'litter-123',
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      color: 'Black',
      birth_weight: '350g',
      current_weight: '450g',
      status: 'Available',
      birth_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      birth_order: 2,
    };
    
    // Mock postpartum care
    const mockCare = await getPostpartumCareForPuppy(puppyId);
    
    // Mock birth details
    const mockBirthDetails = {
      time: '09:15:00',
      weight: '350g',
      assistance_required: false,
      notes: 'Normal birth, no assistance required.',
    };
    
    return {
      puppy: mockPuppy,
      postpartumCare: mockCare,
      birthDetails: mockBirthDetails
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
