
export type DogColor = 
  | 'black'
  | 'brown'
  | 'golden'
  | 'cream'
  | 'white'
  | 'gray'
  | 'red'
  | 'merle'
  | 'brindle'
  | 'mixed';

export type DogBreed = 
  | 'newfoundland'
  | 'golden_retriever'
  | 'labrador_retriever'
  | 'german_shepherd'
  | 'bulldog'
  | 'poodle'
  | 'beagle'
  | 'rottweiler'
  | 'yorkshire_terrier'
  | 'boxer'
  | 'dachshund'
  | 'mixed';

export type DogGender = 'male' | 'female';

export type DogSize = 'small' | 'medium' | 'large' | 'giant';

export type DogStatus = 
  | 'active'
  | 'retired'
  | 'deceased'
  | 'rehomed'
  | 'guardian' 
  | 'sold';

export type DocumentType = 
  | 'registration_certificate'
  | 'health_certificate' 
  | 'microchip_registration'
  | 'pedigree'
  | 'dna_test'
  | 'purchase_agreement'
  | 'vaccination_record'
  | 'other';
