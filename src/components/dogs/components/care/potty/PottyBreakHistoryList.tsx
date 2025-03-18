
import React from 'react';
import { format, parseISO } from 'date-fns';
import { PottyBreakSession } from '@/services/dailyCare/pottyBreak/types';
import { Button } from '@/components/ui/button';
import { Trash2, FileText } from 'lucide-react';
import { deletePottyBreakSession } from '@/services/dailyCare/pottyBreak/pottyBreakSessionService';
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PottyBreakHistoryListProps {
  sessions: PottyBreakSession[];
  isLoading: boolean;
  onDelete: () => void;
}

const PottyBreakHistoryList: React.FC<PottyBreakHistoryListProps> = ({
  sessions,
  isLoading,
  onDelete
}) => {
  const { toast } = useToast();
  const [showNotesFor, setShowNotesFor] = React.useState<string | null>(null);

  const handleDelete = async (sessionId: string) => {
    try {
      await deletePottyBreakSession(sessionId);
      toast({
        title: "Success",
        description: "Potty break session deleted"
      });
      onDelete();
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete potty break session",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse text-gray-400">Loading history...</div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No potty break history found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map(session => {
        const dogs = session.dogs?.map(dogSession => dogSession.dog?.name).filter(Boolean) || [];
        const formattedTime = format(parseISO(session.session_time), 'MMM d, h:mm a');
        const hasNotes = session.notes && session.notes.trim().length > 0;
        
        return (
          <div 
            key={session.id} 
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-3 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{formattedTime}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {dogs.length === 1 
                    ? dogs[0] 
                    : `${dogs.length} dogs: ${dogs.slice(0, 2).join(', ')}${dogs.length > 2 ? ` and ${dogs.length - 2} more` : ''}`
                  }
                </p>
              </div>
              
              <div className="flex space-x-1">
                {hasNotes && (
                  <Dialog open={showNotesFor === session.id} onOpenChange={open => open ? setShowNotesFor(session.id) : setShowNotesFor(null)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <FileText className="h-4 w-4 text-blue-500" />
                            </TooltipTrigger>
                            <TooltipContent>View Notes</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Potty Break Notes - {formattedTime}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700">
                        <p className="whitespace-pre-wrap">{session.notes}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(session.id)}
                  className="h-8 w-8 p-0"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Button>
              </div>
            </div>
            
            {hasNotes && (
              <div className="mt-2">
                <span className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400">
                  <FileText className="h-3 w-3 mr-1" /> 
                  Notes available
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PottyBreakHistoryList;
