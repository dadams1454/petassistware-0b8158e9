
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { Litter } from '@/types/litter';
import { Eye, Edit, Dog, PlayCircle } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';

interface ActiveWelpingsTabProps {
  litters: Litter[];
  isLoading: boolean;
}

const ActiveWelpingsTab: React.FC<ActiveWelpingsTabProps> = ({ 
  litters,
  isLoading
}) => {
  const navigate = useNavigate();
  
  // Filter to show only active whelping litters (recent births within 7 days)
  const activeWhelping = litters.filter(litter => {
    const birthDate = new Date(litter.birth_date);
    const daysSinceBirth = differenceInDays(new Date(), birthDate);
    return daysSinceBirth <= 7;
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading active whelping sessions...</p>
        </div>
      </div>
    );
  }
  
  if (activeWhelping.length === 0) {
    return (
      <EmptyState
        title="No Active Whelping Sessions"
        description="There are no active whelping sessions currently. Start a new whelping session when a dam gives birth."
        icon={<Dog className="h-10 w-10 text-muted-foreground" />}
        action={{
          label: "Start New Whelping",
          onClick: () => navigate('/welping/new'),
        }}
      />
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeWhelping.map((litter) => (
        <Card key={litter.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{litter.litter_name || 'Unnamed Litter'}</CardTitle>
            <CardDescription>
              Birth date: {format(new Date(litter.birth_date), 'MMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Dam:</span>
                <span className="text-sm font-medium">{litter.dam?.name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sire:</span>
                <span className="text-sm font-medium">{litter.sire?.name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Puppies:</span>
                <span className="text-sm font-medium">
                  {typeof litter.puppies === 'number' 
                    ? litter.puppies 
                    : Array.isArray(litter.puppies) 
                      ? litter.puppies.length 
                      : (litter.puppies as any)?.count || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Days since birth:</span>
                <span className="text-sm font-medium">
                  {differenceInDays(new Date(), new Date(litter.birth_date))}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/welping/${litter.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/welping/${litter.id}/logs`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Logs
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(`/welping/${litter.id}/live`)}
              className="ml-auto"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Live Whelping
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ActiveWelpingsTab;
