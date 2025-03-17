import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PottyBreakSession } from '@/services/dailyCare/pottyBreak/types';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { Clock, Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deletePottyBreakSession } from '@/services/dailyCare/pottyBreak/pottyBreakSessionService';

interface PottyBreakHistoryListProps {
  sessions: PottyBreakSession[];
  isLoading: boolean;
  onDelete?: () => void;
}

const PottyBreakHistoryList: React.FC<PottyBreakHistoryListProps> = ({ 
  sessions, 
  isLoading,
  onDelete,
}) => {
  const { toast } = useToast();

  // Calculate the number of dogs in a session
  const getDogCount = (session: PottyBreakSession): number => {
    return session.dogs?.length || 0;
  };

  // Format the session time
  const formatSessionTime = (timestamp: string): string => {
    const date = parseISO(timestamp);
    
    // Format as relative time if less than 24 hours ago
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // Otherwise format as date/time
    return format(date, 'MMM d, yyyy h:mm a');
  };

  // Handle deleting a session
  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deletePottyBreakSession(sessionId);
      toast({
        title: 'Deleted',
        description: 'Potty break session has been deleted.',
      });
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting potty break session:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete potty break session.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading potty break history...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No potty breaks have been logged yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map(session => (
        <Card key={session.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {formatSessionTime(session.session_time)}
                  </span>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Potty Break Record</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this potty break record? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteSession(session.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              <div className="flex items-start mt-3">
                <Users className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm mb-1">
                    <span className="font-medium">{getDogCount(session)} dogs</span> were taken out
                  </div>
                  
                  {session.dogs && session.dogs.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {session.dogs.map(dog => (
                        <div 
                          key={`${session.id}-${dog.dog_id}`} 
                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                        >
                          {dog.dog?.name || 'Unknown Dog'}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {session.notes && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {session.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PottyBreakHistoryList;
