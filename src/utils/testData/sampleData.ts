
// Sample data for test account generation

export const sampleDogs = [
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
    pedigree: true
  }
];

export const sampleCustomers = [
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

// Define health records with appropriate type structure based on DB schema
export const sampleHealthRecords = [
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
    frequency: 'monthly',
    vet_name: 'Dr. Thompson' // Adding required field
  }
];
