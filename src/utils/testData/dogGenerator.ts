
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { sampleDogs, sampleHealthRecords } from './sampleData';

/**
 * Creates test dogs and their health records in the database
 */
export const createTestDogs = async (): Promise<string[]> => {
  console.log('Creating test dogs...');
  
  // Step 1: Create dogs
  const dogIds: string[] = [];
  for (const dog of sampleDogs) {
    const newDog = {
      ...dog,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('dogs')
      .upsert(newDog)
      .select('id');
      
    if (error) {
      console.error('Error creating test dog:', error);
      throw error;
    }
    
    if (data && data[0]) {
      dogIds.push(data[0].id);
      console.log(`Created test dog: ${dog.name}`);
    }
  }
  
  // Step 2: Create health records for dogs
  await createHealthRecords(dogIds);
  
  return dogIds;
};

/**
 * Creates health records for the provided dog IDs
 */
const createHealthRecords = async (dogIds: string[]): Promise<void> => {
  for (const dogId of dogIds) {
    for (const record of sampleHealthRecords) {
      const newRecord = {
        ...record,
        dog_id: dogId,
        id: uuidv4(),
        created_at: new Date().toISOString()
      };
      
      // Handle different record types with appropriate fields
      let recordToInsert;
      
      if (newRecord.record_type === 'examination') {
        recordToInsert = newRecord;
      } else if (newRecord.record_type === 'vaccination') {
        recordToInsert = newRecord;
      } else if (newRecord.record_type === 'medication') {
        recordToInsert = {
          ...newRecord,
          visit_date: newRecord.start_date // Add visit_date which is required
        };
      }
      
      const { error } = await supabase
        .from('health_records')
        .upsert(recordToInsert);
        
      if (error) {
        console.error('Error creating health record:', error);
        // Continue despite errors
      }
    }
    console.log(`Created health records for dog ID: ${dogId}`);
  }
};
