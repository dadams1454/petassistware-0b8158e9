
import { SocializationCategory } from '../types';

export const socializationCategoryOptions: Record<string, string[]> = {
  'sounds': [
    'Household appliances', 
    'Doorbell/knocking', 
    'Vacuum cleaner', 
    'Thunder recording', 
    'Music', 
    'Traffic sounds', 
    'Children playing'
  ],
  'people': [
    'Men with beards', 
    'People with hats', 
    'Children', 
    'Elderly people', 
    'People in uniforms', 
    'People of different ethnicities', 
    'People with mobility aids'
  ],
  'animals': [
    'Other puppies', 
    'Adult dogs', 
    'Cats', 
    'Farm animals', 
    'Small pets', 
    'Birds'
  ],
  'environments': [
    'Car rides', 
    'Park visits', 
    'Vet clinic visit', 
    'Different floor surfaces', 
    'Stairs', 
    'Outdoor environments', 
    'Urban environments'
  ],
  'handling': [
    'Nail trimming', 
    'Teeth examination', 
    'Ear cleaning', 
    'Bathing', 
    'Brushing', 
    'Being held by strangers', 
    'Collar/harness wearing'
  ],
  'objects': [
    'Umbrellas', 
    'Moving toys', 
    'Wheeled objects', 
    'Plastic bags', 
    'Crates/carriers', 
    'Different textures'
  ]
};

export const socializationReactions = [
  { id: 'curious', name: 'Curious', color: 'bg-blue-100 text-blue-800' },
  { id: 'cautious', name: 'Cautious', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'confident', name: 'Confident', color: 'bg-green-100 text-green-800' },
  { id: 'fearful', name: 'Fearful', color: 'bg-red-100 text-red-800' },
  { id: 'playful', name: 'Playful', color: 'bg-purple-100 text-purple-800' },
  { id: 'indifferent', name: 'Indifferent', color: 'bg-gray-100 text-gray-800' }
];
