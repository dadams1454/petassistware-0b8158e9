
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { Dog, Calendar, Users, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Litter {
  id: string;
  birth_date: string;
  litter_name?: string;
  dam?: {
    id: string;
    name: string;
    breed?: string;
    photo_url?: string;
    is_pregnant?: boolean;
  };
  sire?: {
    id: string;
    name: string;
    breed?: string;
    photo_url?: string;
  };
  puppies?: any;
  status?: string;
}

interface ActiveWelpingsListProps {
  litters: Litter[];
  isLoading: boolean;
}

const ActiveWelpingsList: React.FC<ActiveWelpingsListProps> = ({ litters, isLoading }) => {
  const navigate = useNavigate();
  
  const getPuppyCount = (puppies: any): number => {
    if (!puppies) return 0;
    
    if (typeof puppies === 'number') return puppies;
    
    if (Array.isArray(puppies)) return puppies.length;
    
    if (typeof puppies === 'object') {
      if ('count' in puppies && typeof puppies.count === 'number') {
        return puppies.count;
      }
    }
    
    return 0;
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-12" />
                  <Skeleton className="h-10 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!litters.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <Baby className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Active Whelpings</h3>
          <p className="text-muted-foreground text-center mb-4">
            Start a new whelping session to begin tracking puppy births and development.
          </p>
          <Button onClick={() => navigate('/welping/new')}>Start New Whelping</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {litters.map(litter => {
        const birthDate = new Date(litter.birth_date);
        const today = new Date();
        const daysSinceBirth = differenceInDays(today, birthDate);
        const puppyCount = getPuppyCount(litter.puppies);
        
        return (
          <Card key={litter.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium truncate">
                    {litter.litter_name || `${litter.dam?.name || 'Unknown'}'s Litter`}
                  </h3>
                  <Badge variant={daysSinceBirth <= 7 ? "default" : "secondary"}>
                    {daysSinceBirth <= 0 ? 'Today' : `${daysSinceBirth} days old`}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {format(birthDate, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Dog className="h-4 w-4 mr-1" />
                    <span>
                      {litter.dam?.name || 'Unknown dam'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Baby className="h-4 w-4 mr-1" />
                    <span>{puppyCount} puppies</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/welping/${litter.id}/logs`)}
                  >
                    View Logs
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/welping/${litter.id}`)}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ActiveWelpingsList;
