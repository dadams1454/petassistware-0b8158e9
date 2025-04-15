
import { Dog, DogGender, DogStatus } from '@/types/dog';

export const mockDogs: Dog[] = [
  {
    id: '1',
    name: 'Luna',
    breed: 'Newfoundland',
    gender: DogGender.FEMALE_LOWER,
    color: 'Black',
    birthdate: '2021-05-15',
    status: DogStatus.ACTIVE,
    created_at: '2021-05-20T12:00:00Z',
    photo_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1296&q=80',
    is_pregnant: false
  },
  {
    id: '2',
    name: 'Max',
    breed: 'Newfoundland',
    gender: DogGender.MALE_LOWER,
    color: 'Brown',
    birthdate: '2020-02-10',
    status: DogStatus.ACTIVE,
    created_at: '2020-03-01T12:00:00Z',
    photo_url: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
    is_pregnant: false
  },
  {
    id: '3',
    name: 'Bella',
    breed: 'Newfoundland',
    gender: DogGender.FEMALE_LOWER,
    color: 'Black & White',
    birthdate: '2022-10-22',
    status: DogStatus.ACTIVE,
    created_at: '2022-11-15T12:00:00Z',
    photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=662&q=80',
    is_pregnant: true,
    last_heat_date: '2023-01-15T12:00:00Z',
    tie_date: '2023-01-18T12:00:00Z'
  },
  {
    id: '4',
    name: 'Rocky',
    breed: 'Newfoundland',
    gender: DogGender.MALE_LOWER,
    color: 'Gray',
    birthdate: '2019-08-05',
    status: DogStatus.INACTIVE,
    created_at: '2019-09-01T12:00:00Z',
    photo_url: 'https://images.unsplash.com/photo-1579534095153-aeca3cf0b937?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80'
  },
  {
    id: '5',
    name: 'Daisy',
    breed: 'Newfoundland',
    gender: DogGender.FEMALE_LOWER,
    color: 'Chocolate',
    birthdate: '2021-11-30',
    status: DogStatus.GUARDIAN,
    created_at: '2022-01-15T12:00:00Z',
    photo_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80'
  }
];

export default mockDogs;
