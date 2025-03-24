
import { supabase } from '@/integrations/supabase/client';
import { sampleDogs } from './sampleData';

/**
 * Creates a test litter and puppies in the database
 */
export const createTestLitter = async (dogIds: string[]): Promise<void> => {
  console.log('Creating test litter and puppies...');
  
  if (dogIds.length < 2) {
    console.log('Not enough dogs to create a litter');
    return;
  }
  
  // Find male and female dogs for breeding
  const maleDog = sampleDogs.find(d => d.gender === 'male');
  const femaleDog = sampleDogs.find(d => d.gender === 'female');
  
  if (!maleDog || !femaleDog) {
    console.log('Need both male and female dogs to create a litter');
    return;
  }
  
  // Create litter data
  const litterPayload = {
    litter_name: 'Test Litter A',
    sire_id: dogIds[0], // First male
    dam_id: dogIds[1], // First female
    birth_date: new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 8 weeks ago
    kennel_name: 'Bear Paw Newfoundlands',
    puppy_count: 5,
    male_count: 3,
    female_count: 2,
    status: 'active',
    notes: 'Test litter for demonstration purposes',
    expected_go_home_date: new Date(Date.now() + 2 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
    // Add required breeder_id as null - will be populated by RLS policy if needed
    breeder_id: null
  };
  
  // Insert litter into database
  const { data: litterResponse, error: litterError } = await supabase
    .from('litters')
    .upsert(litterPayload)
    .select('id');
    
  if (litterError) {
    console.error('Error creating test litter:', litterError);
    return;
  }
  
  if (litterResponse && litterResponse[0]) {
    const litterId = litterResponse[0].id;
    
    // Create puppies for this litter
    await createPuppiesForLitter(litterId);
  }
};

/**
 * Creates test puppies for a litter
 */
const createPuppiesForLitter = async (litterId: string): Promise<void> => {
  const puppyData = [
    { 
      name: 'Puppy 1',
      gender: 'male',
      color: 'black',
      litter_id: litterId,
      status: 'Available',
      birth_weight: '1.2 lbs',
      current_weight: '7.5 lbs',
      notes: 'Largest male in the litter'
    },
    { 
      name: 'Puppy 2',
      gender: 'female',
      color: 'brown',
      litter_id: litterId,
      status: 'Reserved',
      birth_weight: '1.0 lbs',
      current_weight: '6.8 lbs',
      notes: 'Very social and playful'
    },
    { 
      name: 'Puppy 3',
      gender: 'male',
      color: 'gray',
      litter_id: litterId,
      status: 'Available',
      birth_weight: '1.1 lbs',
      current_weight: '7.2 lbs',
      notes: 'Calm temperament'
    }
  ];
  
  for (const puppy of puppyData) {
    const { error: puppyError } = await supabase
      .from('puppies')
      .upsert(puppy);
      
    if (puppyError) {
      console.error('Error creating test puppy:', puppyError);
    }
  }
  
  console.log(`Created test litter with puppies`);
};
