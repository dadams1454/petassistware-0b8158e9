
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Puppy } from '@/types/litter';

// Define types for welping records
export interface WelpingRecord {
  id: string;
  litter_id: string;
  recording_date: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  total_puppies_born: number;
  live_puppies_born: number;
  stillborn_puppies: number;
  dam_condition: string;
  complications?: string;
  assistance_required: boolean;
  assistance_details?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export interface WelpingObservation {
  id: string;
  welping_id: string;
  observation_time: string;
  puppy_number?: number;
  puppy_id?: string;
  presentation?: string;
  coloration?: string;
  activity_level?: string;
  weight?: number;
  weight_unit?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export interface PostpartumCare {
  id: string;
  litter_id: string;
  date: string;
  dam_temperature?: number;
  dam_appetite?: string;
  dam_hydration?: string;
  dam_discharge?: string;
  dam_milk_production?: string;
  dam_behavior?: string;
  puppies_nursing?: boolean;
  all_puppies_nursing?: boolean;
  puppy_weights_recorded?: boolean;
  weight_concerns?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Mock data for testing
const mockWelpingRecords: WelpingRecord[] = [];
const mockWelpingObservations: WelpingObservation[] = [];
const mockPostpartumCare: PostpartumCare[] = [];

// Create a welping record
export const createWelpingRecord = async (record: Omit<WelpingRecord, 'id' | 'created_at'>): Promise<WelpingRecord> => {
  try {
    // In a real implementation, this would insert into the database
    // For now, just create a mock record
    const newRecord: WelpingRecord = {
      ...record,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    
    mockWelpingRecords.push(newRecord);
    return newRecord;
  } catch (error) {
    console.error('Error creating welping record:', error);
    throw error;
  }
};

// Get welping records for a litter
export const getWelpingRecordsForLitter = async (litterId: string): Promise<WelpingRecord[]> => {
  try {
    // In a real implementation, this would query the database
    return mockWelpingRecords.filter(record => record.litter_id === litterId);
  } catch (error) {
    console.error('Error fetching welping records:', error);
    return [];
  }
};

// Update a welping record
export const updateWelpingRecord = async (
  recordId: string,
  updates: Partial<WelpingRecord>
): Promise<WelpingRecord | null> => {
  try {
    // In a real implementation, this would update the database
    const index = mockWelpingRecords.findIndex(record => record.id === recordId);
    if (index === -1) return null;
    
    mockWelpingRecords[index] = {
      ...mockWelpingRecords[index],
      ...updates
    };
    
    return mockWelpingRecords[index];
  } catch (error) {
    console.error('Error updating welping record:', error);
    return null;
  }
};

// Add welping observation
export const addWelpingObservation = async (
  observation: Omit<WelpingObservation, 'id' | 'created_at'>
): Promise<WelpingObservation> => {
  try {
    // In a real implementation, this would insert into the database
    const newObservation: WelpingObservation = {
      ...observation,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    
    mockWelpingObservations.push(newObservation);
    return newObservation;
  } catch (error) {
    console.error('Error adding welping observation:', error);
    throw error;
  }
};

// Get welping observations
export const getWelpingObservations = async (welpingId: string): Promise<WelpingObservation[]> => {
  try {
    // In a real implementation, this would query the database
    return mockWelpingObservations.filter(obs => obs.welping_id === welpingId);
  } catch (error) {
    console.error('Error fetching welping observations:', error);
    return [];
  }
};

// Add postpartum care record
export const addPostpartumCare = async (
  record: Omit<PostpartumCare, 'id' | 'created_at'>
): Promise<PostpartumCare> => {
  try {
    // In a real implementation, this would insert into the database
    const newRecord: PostpartumCare = {
      ...record,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    
    mockPostpartumCare.push(newRecord);
    return newRecord;
  } catch (error) {
    console.error('Error adding postpartum care record:', error);
    throw error;
  }
};

// Get postpartum care records
export const getPostpartumCareRecords = async (litterId: string): Promise<PostpartumCare[]> => {
  try {
    // In a real implementation, this would query the database
    return mockPostpartumCare.filter(record => record.litter_id === litterId);
  } catch (error) {
    console.error('Error fetching postpartum care records:', error);
    return [];
  }
};

// Get puppy observations
export const getPuppyObservations = async (puppyId: string): Promise<WelpingObservation[]> => {
  try {
    // In a real implementation, this would query the database
    return mockWelpingObservations.filter(obs => obs.puppy_id === puppyId);
  } catch (error) {
    console.error('Error fetching puppy observations:', error);
    return [];
  }
};

// Update puppy with AKC information or other details
export const updatePuppy = async (
  puppyId: string,
  updates: Partial<Puppy>
): Promise<Puppy | null> => {
  try {
    // Since we don't have direct DB access in this mock implementation,
    // we'll pretend it succeeded and return a mock puppy with updates
    const mockPuppy: Puppy = {
      id: puppyId,
      litter_id: updates.litter_id || 'litter-id',
      name: updates.name || 'Puppy',
      gender: updates.gender || 'male',
      color: updates.color || 'black',
      birth_weight: updates.birth_weight || 0.5,
      birth_order: updates.birth_order || 1,
      status: updates.status || 'available',
      microchip_id: updates.microchip_id,
      akc_registration: updates.akc_registration,
      notes: updates.notes,
      collar_color: updates.collar_color
    };
    
    return mockPuppy;
  } catch (error) {
    console.error('Error updating puppy:', error);
    return null;
  }
};
