
import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, PawPrint, Calendar, Baby } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, addDays } from 'date-fns';
import { 
  Table, 
  TableHeader, 
  TableHead, 
  TableRow,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import DogHealthSection from './DogHealthSection';

interface DogsListProps {
  dogs: any[];
  onView: (dog: any) => void;
  onEdit: (dog: any) => void;
  onDelete: (dogId: string) => void;
}

const DogsList = ({ dogs, onView, onEdit, onDelete }: DogsListProps) => {
  // Group dogs by gender
  const groupedDogs = useMemo(() => {
    const females = dogs.filter(dog => dog.gender === 'Female');
    // Sort females by age (oldest first)
    const sortedFemales = [...females].sort((a, b) => {
      if (!a.birthdate) return 1; // Dogs without birthdate go last
      if (!b.birthdate) return -1;
      return new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime();
    });
    
    const males = dogs.filter(dog => dog.gender === 'Male');
    // Sort males by age (oldest first)
    const sortedMales = [...males].sort((a, b) => {
      if (!a.birthdate) return 1; // Dogs without birthdate go last
      if (!b.birthdate) return -1;
      return new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime();
    });
    
    const unknown = dogs.filter(dog => !dog.gender);
    
    return {
      females: sortedFemales,
      males: sortedMales,
      unknown
    };
  }, [dogs]);

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
            <Card key={dog.id} className="overflow-hidden">
              <CardHeader className="p-0 h-48 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div 
                  className="h-full w-full bg-muted"
                  style={{
                    backgroundImage: dog.photo_url ? `url(${dog.photo_url})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!dog.photo_url && (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-4xl">🐾</span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold text-white">{dog.name}</h3>
                  <p className="text-white/80">{dog.breed}</p>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {dog.gender && (
                    <div>
                      <span className="text-muted-foreground">Gender:</span> {dog.gender}
                    </div>
                  )}
                  {dog.birthdate && (
                    <div>
                      <span className="text-muted-foreground">Age:</span>{' '}
                      {format(new Date(dog.birthdate), 'PPP')}
                    </div>
                  )}
                  {dog.color && (
                    <div>
                      <span className="text-muted-foreground">Color:</span> {dog.color}
                    </div>
                  )}
                  {dog.weight && (
                    <div>
                      <span className="text-muted-foreground">Weight:</span> {dog.weight} kg
                    </div>
                  )}
                </div>
                {dog.pedigree && (
                  <div className="mt-3">
                    <Badge variant="outline" className="bg-primary/10">Pedigree</Badge>
                  </div>
                )}
                
                {/* Health section for female dogs */}
                {dog.gender === 'Female' && (
                  <div className="mt-4">
                    <Separator className="my-2" />
                    <h4 className="font-medium text-sm mb-2 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-pink-500" />
                      <span>Health & Breeding</span>
                    </h4>
                    <DogHealthSection dog={dog} />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button variant="ghost" size="sm" onClick={() => onView(dog)}>
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <div className="space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(dog)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(dog.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderDogGroup(groupedDogs.females, "Females", <PawPrint className="h-5 w-5 text-pink-500" />)}
      {renderDogGroup(groupedDogs.males, "Males", <PawPrint className="h-5 w-5 text-blue-500" />)}
      {renderDogGroup(groupedDogs.unknown, "Unspecified Gender", null)}
    </div>
  );
};

export default DogsList;
