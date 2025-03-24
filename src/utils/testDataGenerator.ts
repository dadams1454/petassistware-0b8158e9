
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { DogProfile } from '@/types/dog';

// Sample data for the test account
const sampleDogs: Partial<DogProfile>[] = [
  {
    name: 'Bear',
    breed: 'newfoundland',
    gender: 'male',
    color: 'black',
    birthdate: '2020-05-15',
    weight: 150,
    weight_unit: 'lbs',
    status: 'active',
    notes: 'Gentle giant with a heart of gold. Loves swimming and children.',
    microchip_number: 'TEST-123456789',
    registration_number: 'AKC-TEST-123',
    registration_organization: 'AKC',
    pedigree: true
  },
  {
    name: 'Luna',
    breed: 'newfoundland',
    gender: 'female',
    color: 'brown',
    birthdate: '2019-08-22',
    weight: 120,
    weight_unit: 'lbs',
    status: 'active',
    notes: 'Beautiful female with excellent temperament. Champion bloodlines.',
    microchip_number: 'TEST-987654321',
    registration_number: 'AKC-TEST-456',
    registration_organization: 'AKC',
    pedigree: true,
    is_pregnant: false,
    last_heat_date: '2023-04-10'
  },
  {
    name: 'Max',
    breed: 'newfoundland',
    gender: 'male',
    color: 'gray',
    birthdate: '2021-02-10',
    weight: 130,
    weight_unit: 'lbs',
    status: 'active',
    notes: 'Young male with excellent structure. Training for water rescue.',
    microchip_number: 'TEST-456789123',
    registration_number: 'AKC-TEST-789',
    registration_organization: 'AKC',
    pedigree: true
  }
];

const sampleCustomers = [
  {
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    address: '123 Main St, Anytown, USA',
    notes: 'Interested in a male puppy from next litter',
    metadata: {
      customer_type: 'new',
      customer_since: new Date().toISOString().split('T')[0],
      waitlist_type: 'open'
    }
  },
  {
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.j@example.com',
    phone: '555-987-6543',
    address: '456 Oak Ave, Somewhere, USA',
    notes: 'Previous owner of one of our dogs',
    metadata: {
      customer_type: 'returning',
      customer_since: '2021-06-15',
      waitlist_type: 'specific'
    }
  }
];

const sampleHealthRecords = [
  {
    record_type: 'examination',
    title: 'Annual Checkup',
    description: 'Complete physical examination',
    visit_date: '2023-11-15',
    vet_name: 'Dr. Williams',
    vet_clinic: 'Paws & Claws Veterinary',
    findings: 'Excellent overall health',
    recommendations: 'Continue current diet and exercise'
  },
  {
    record_type: 'vaccination',
    title: 'Rabies Vaccination',
    description: 'Three-year rabies vaccination',
    visit_date: '2023-10-05',
    vet_name: 'Dr. Martinez',
    vaccine_name: 'RabVac 3',
    manufacturer: 'Boehringer Ingelheim',
    lot_number: 'TEST-123-VAX',
    next_due_date: '2026-10-05'
  },
  {
    record_type: 'medication',
    title: 'Heartworm Prevention',
    description: 'Monthly heartworm preventative',
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    medication_name: 'HeartGuard Plus',
    dosage: 1,
    dosage_unit: 'tablet',
    frequency: 'monthly'
  }
];

/**
 * Creates test data in the database for demonstration purposes
 */
export const generateTestData = async (): Promise<{
  success: boolean;
  message: string;
  dogIds?: string[];
  customerIds?: string[];
}> => {
  try {
    console.log('Starting test data generation...');
    
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
        .insert(newDog)
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
    for (const dogId of dogIds) {
      for (const record of sampleHealthRecords) {
        const newRecord = {
          ...record,
          dog_id: dogId,
          id: uuidv4(),
          created_at: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('health_records')
          .insert(newRecord);
          
        if (error) {
          console.error('Error creating health record:', error);
          // Continue despite errors
        }
      }
      console.log(`Created health records for dog ID: ${dogId}`);
    }
    
    // Step 3: Create customers
    const customerIds: string[] = [];
    for (const customer of sampleCustomers) {
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select('id');
        
      if (error) {
        console.error('Error creating test customer:', error);
        // Continue despite errors
      }
      
      if (data && data[0]) {
        customerIds.push(data[0].id);
        console.log(`Created test customer: ${customer.first_name} ${customer.last_name}`);
      }
    }
    
    // Step 4: Create a test litter if we have both male and female dogs
    const maleDog = sampleDogs.find(d => d.gender === 'male');
    const femaleDog = sampleDogs.find(d => d.gender === 'female');
    
    if (maleDog && femaleDog && dogIds.length >= 2) {
      const litterData = {
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
      };
      
      const { data: litterData, error: litterError } = await supabase
        .from('litters')
        .insert(litterData)
        .select('id');
        
      if (litterError) {
        console.error('Error creating test litter:', litterError);
      } else if (litterData && litterData[0]) {
        const litterId = litterData[0].id;
        
        // Create puppies for this litter
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
            .insert(puppy);
            
          if (puppyError) {
            console.error('Error creating test puppy:', puppyError);
          }
        }
        
        console.log(`Created test litter with puppies`);
      }
    }
    
    return {
      success: true,
      message: 'Test data successfully generated!',
      dogIds,
      customerIds
    };
    
  } catch (error) {
    console.error('Error generating test data:', error);
    return {
      success: false,
      message: `Error generating test data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
