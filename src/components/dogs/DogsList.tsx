
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Bell, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import DogStatusCard from './components/DogStatusCard';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '@/services/eventService';
import { DogProfile } from '@/types/dog';
import DogCard from './components/DogCard';

interface DogsListProps {
  dogs: any[];
  onView: (dog: any) => void;
  onEdit: (dog: any) => void;
  onDelete: (dogId: string) => void;
}

const DogsList = ({ dogs }: DogsListProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  
  // Fetch all events
  const { data: allEvents } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
  
  // Get upcoming appointments for each dog
  const dogAppointments = useMemo(() => {
    if (!allEvents) return {};
    
    const appointments: Record<string, number> = {};
    
    allEvents.forEach(event => {
      if (event.status === 'completed' || event.status === 'cancelled') {
        return;
      }
      
      dogs.forEach(dog => {
        if (event.title?.toLowerCase().includes(dog.name.toLowerCase()) || 
            event.description?.toLowerCase().includes(dog.name.toLowerCase())) {
          appointments[dog.id] = (appointments[dog.id] || 0) + 1;
        }
      });
    });
    
    return appointments;
  }, [allEvents, dogs]);
  
  // Filter dogs based on search term and filters
  const filteredDogs = useMemo(() => {
    return dogs.filter(dog => {
      // Name or breed search
      const matchesSearch = searchTerm === '' || 
        (dog.name && dog.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (dog.breed && dog.breed.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || dog.status === statusFilter;
      
      // Gender filter
      const matchesGender = genderFilter === 'all' || 
        (dog.gender && dog.gender.toLowerCase() === genderFilter.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesGender;
    });
  }, [dogs, searchTerm, statusFilter, genderFilter]);
  
  // Group dogs by gender
  const groupedDogs = useMemo(() => {
    const females = filteredDogs.filter(dog => dog.gender === 'Female');
    // Sort females by age (oldest first)
    const sortedFemales = [...females].sort((a, b) => {
      if (!a.birthdate) return 1; // Dogs without birthdate go last
      if (!b.birthdate) return -1;
      return new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime();
    });
    
    const males = filteredDogs.filter(dog => dog.gender === 'Male');
    // Sort males by age (oldest first)
    const sortedMales = [...males].sort((a, b) => {
      if (!a.birthdate) return 1; // Dogs without birthdate go last
      if (!b.birthdate) return -1;
      return new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime();
    });
    
    const unknown = filteredDogs.filter(dog => !dog.gender);
    
    return {
      females: sortedFemales,
      males: sortedMales,
      unknown
    };
  }, [filteredDogs]);

  if (dogs.length === 0) {
    return (
      <div className="text-center p-8 bg-muted rounded-lg">
        <h3 className="font-medium text-lg mb-2">No dogs found</h3>
        <p className="text-muted-foreground">
          You haven't added any dogs yet. Click the "Add Dog" button to get started.
        </p>
      </div>
    );
  }

  // No filtered dogs message
  if (filteredDogs.length === 0 && searchTerm.length > 0) {
    return (
      <div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search dogs by name or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="deceased">Deceased</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-40">
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center p-8 bg-muted rounded-lg">
          <h3 className="font-medium text-lg mb-2">No dogs found</h3>
          <p className="text-muted-foreground">
            No dogs found matching your search criteria. Try adjusting your filters.
          </p>
        </div>
      </div>
    );
  }

  const renderDogGroup = (dogs: any[], title: string, icon: React.ReactNode) => {
    if (dogs.length === 0) return null;
    
    return (
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h2 className="text-xl font-semibold">{title} ({dogs.length})</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dogs.map((dog) => (
            <DogCard 
              key={dog.id} 
              dog={dog} 
              appointmentCount={dogAppointments[dog.id] || 0}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search dogs by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="deceased">Deceased</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-40">
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {renderDogGroup(groupedDogs.females, "Females", <PawPrint className="h-5 w-5 text-pink-500" />)}
      {renderDogGroup(groupedDogs.males, "Males", <PawPrint className="h-5 w-5 text-blue-500" />)}
      {renderDogGroup(groupedDogs.unknown, "Unspecified Gender", null)}
    </div>
  );
};

export default DogsList;
