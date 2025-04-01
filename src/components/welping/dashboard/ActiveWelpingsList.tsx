
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { Calendar, Dog, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Litter {
  id: string;
  birth_date: string;
  dam?: any;
  sire?: any;
  puppies?: any;
  litter_name?: string;
  puppy_count?: number;
}

interface ActiveWelpingsListProps {
  litters: Litter[];
  isLoading: boolean;
}

const ActiveWelpingsList: React.FC<ActiveWelpingsListProps> = ({ litters, isLoading }) => {
  const navigate = useNavigate();
  
  const getWelpingStatus = (litter: Litter) => {
    if (!litter.birth_date) return 'Preparing';
    
    const today = new Date();
    const birthDate = new Date(litter.birth_date);
    const daysSinceBirth = differenceInDays(today, birthDate);
    
    if (daysSinceBirth < 0) return 'Scheduled';
    if (daysSinceBirth === 0) return 'In Progress';
    if (daysSinceBirth <= 7) return 'Recent';
    return 'Active';
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Recent':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preparing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (litters.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="py-8 space-y-4">
            <Dog className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-medium text-lg">No Active Whelpings</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are currently no active whelpings or pregnant dogs. Use the "Start New Welping" button to begin the process.
            </p>
            <Button 
              onClick={() => navigate('/welping/new')}
              className="mt-2"
            >
              Start New Welping
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {litters.map(litter => {
        const status = getWelpingStatus(litter);
        
        return (
          <Card key={litter.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={litter.dam?.photo_url} alt={litter.dam?.name || 'Dam'} />
                    <AvatarFallback>
                      <Dog className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {litter.litter_name || `${litter.dam?.name || 'Unknown'}'s Litter`}
                      </h3>
                      <Badge variant="outline" className={getStatusBadgeColor(status)}>
                        {status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {litter.birth_date 
                          ? format(new Date(litter.birth_date), 'MMM d, yyyy')
                          : 'Birth date not set'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {(litter.puppies?.count || litter.puppy_count || 0)} Puppies
                      </Badge>
                      {litter.dam && (
                        <Badge variant="outline" className="text-xs">
                          Dam: {litter.dam.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="sm:self-center"
                  onClick={() => navigate(`/welping/${litter.id}`)}
                >
                  Manage
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ActiveWelpingsList;
