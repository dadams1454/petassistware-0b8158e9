
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCareActivities } from '@/hooks/useCareActivities';
import { formatDistanceToNow } from 'date-fns';
import { Dog, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DogCareCardProps {
  dog: {
    id: string;
    name: string;
    photo_url?: string;
  };
}

export function DogCareCard({ dog }: DogCareCardProps) {
  const { lastActivity, recordActivity, isRecording } = useCareActivities(dog.id, 'potty');
  
  const handlePottyBreak = () => {
    recordActivity({
      dog_id: dog.id,
      activity_type: 'potty',
      timestamp: new Date().toISOString(),
    });
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col p-4">
          <div className="flex items-start mb-3">
            <div className="flex-shrink-0 mr-4">
              {dog.photo_url ? (
                <img
                  src={dog.photo_url}
                  alt={dog.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Dog className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <Link to={`/dogs/${dog.id}`} className="hover:underline">
                <h3 className="font-semibold text-lg">{dog.name}</h3>
              </Link>
              
              <div className="mt-1 text-sm text-muted-foreground flex items-center">
                <PawPrint className="h-3 w-3 mr-1" />
                Last potty break: {lastActivity 
                  ? formatDistanceToNow(new Date(lastActivity.timestamp), { addSuffix: true }) 
                  : 'No records'}
              </div>
            </div>
            
            <Button 
              size="sm" 
              onClick={handlePottyBreak}
              disabled={isRecording}
              className="ml-2"
            >
              {isRecording ? 'Recording...' : 'Potty Break'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
