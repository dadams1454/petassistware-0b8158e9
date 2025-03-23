
export interface BreedingAnalyticsProps {
  className?: string;
}

export interface Litter {
  id: string;
  litter_name: string;
  birth_date: string;
  dam: {
    id: string;
    name: string;
  } | null;
  sire: {
    id: string;
    name: string;
  } | null;
  puppies: Puppy[];
}
