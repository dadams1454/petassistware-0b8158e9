
import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { DogProfile } from '@/types/dog';
import { useDogsFiltering } from './hooks/useDogsFiltering';
import { useDogAppointments } from './hooks/useDogAppointments';
import SearchFilters from './components/SearchFilters';
import DogGroup from './components/DogGroup';
import NoDogsFound from './components/NoDogsFound';

interface DogsListProps {
  dogs: any[];
  onView: (dog: any) => void;
  onEdit: (dog: any) => void;
  onDelete: (dogId: string) => void;
}

const DogsList = ({ dogs }: DogsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  
  // Get dog appointments
  const dogAppointments = useDogAppointments(dogs);
  
  // Filter and group dogs
  const { filteredDogs, groupedDogs } = useDogsFiltering(
    dogs,
    searchTerm,
    statusFilter,
    genderFilter
  );

  if (dogs.length === 0) {
    return <NoDogsFound hasSearch={false} />;
  }

  // No filtered dogs message
  if (filteredDogs.length === 0 && searchTerm.length > 0) {
    return (
      <div>
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
        />
        
        <NoDogsFound hasSearch={true} />
      </div>
    );
  }

  return (
    <div>
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
      />

      <DogGroup
        dogs={groupedDogs.females}
        title="Females"
        icon={<PawPrint className="h-5 w-5 text-pink-500" />}
        dogAppointments={dogAppointments}
      />
      
      <DogGroup
        dogs={groupedDogs.males}
        title="Males"
        icon={<PawPrint className="h-5 w-5 text-blue-500" />}
        dogAppointments={dogAppointments}
      />
      
      {groupedDogs.unknown.length > 0 && (
        <DogGroup
          dogs={groupedDogs.unknown}
          title="Unspecified Gender"
          icon={null}
          dogAppointments={dogAppointments}
        />
      )}
    </div>
  );
};

export default DogsList;
