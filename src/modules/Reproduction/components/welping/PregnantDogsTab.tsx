
import React from 'react';
import { 
  Card, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Dog } from '@/types/dog';
import { format, addDays, differenceInDays } from 'date-fns';
import { Paw, Calendar, Dog as DogIcon } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';

interface PregnantDogsTabProps {
  dogs: Dog[];
  isLoading: boolean;
}

const PregnantDogsTab: React.FC<PregnantDogsTabProps> = ({ 
  dogs,
  isLoading
}) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading pregnant dogs...</p>
        </div>
      </div>
    );
  }
  
  if (dogs.length === 0) {
    return (
      <EmptyState
        title="No Pregnant Dogs"
        description="There are no pregnant dogs currently registered in the system."
        icon={<DogIcon className="h-10 w-10 text-muted-foreground" />}
        action={{
          label: "Start Breeding Prep",
          onClick: () => navigate('/breeding-prep'),
        }}
      />
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dogs.map((dog) => {
        // Calculate estimated due date (63 days after tie date)
        const tieDate = dog.tie_date ? new Date(dog.tie_date) : null;
        const dueDate = tieDate ? addDays(tieDate, 63) : null;
        const daysUntilDue = dueDate ? differenceInDays(dueDate, new Date()) : null;
        
        return (
          <Card key={dog.id} className="overflow-hidden">
            <div className="relative h-40 bg-muted">
              {dog.photo_url ? (
                <img 
                  src={dog.photo_url} 
                  alt={dog.name} 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <DogIcon className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-white font-medium text-xl">{dog.name}</h3>
                <p className="text-white/80 text-sm">{dog.breed}</p>
              </div>
            </div>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {tieDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Breeding date:
                    </span>
                    <span className="text-sm font-medium">
                      {format(tieDate, 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
                {dueDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1">
                      <Paw className="h-4 w-4" /> Due date:
                    </span>
                    <span className="text-sm font-medium">
                      {format(dueDate, 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
                {daysUntilDue !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Days until due:</span>
                    <span className={`text-sm font-medium ${daysUntilDue <= 7 ? 'text-red-500' : ''}`}>
                      {daysUntilDue}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Color:</span>
                  <span className="text-sm font-medium">{dog.color || 'Unknown'}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/dogs/${dog.id}/reproductive`)}
              >
                View Reproductive Record
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  );
};

export default PregnantDogsTab;
