
import React from 'react';
import { Card, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, FileText, Trash2, AlertCircle } from 'lucide-react';
import { PottyBreakSession } from '@/services/dailyCare/pottyBreak';
import { format, parseISO } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface PottyBreakHistoryTabProps {
  sessions: PottyBreakSession[];
  isLoading: boolean;
  onRefresh: () => void;
  onDelete?: (sessionId: string) => Promise<void>;
  deletingSessionId?: string | null;
}

const PottyBreakHistoryTab: React.FC<PottyBreakHistoryTabProps> = ({
  sessions,
  isLoading,
  onRefresh,
  onDelete,
  deletingSessionId
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [sessionToDelete, setSessionToDelete] = React.useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = React.useState<string | null>(null);

  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (sessionToDelete && onDelete) {
      await onDelete(sessionToDelete);
      setDeleteConfirmOpen(false);
      setSessionToDelete(null);
    }
  };

  const toggleExpandNotes = (sessionId: string) => {
    setExpandedNotes(expandedNotes === sessionId ? null : sessionId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Recent Potty Break Observations</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh} 
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-400">Loading history...</div>
        </div>
      ) : sessions.length === 0 ? (
        <Card className="p-4 text-center text-muted-foreground">
          No recent potty breaks recorded.
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => {
            const hasNotes = session.notes && session.notes.trim().length > 0;
            const isExpanded = expandedNotes === session.id;
            
            return (
              <Card key={session.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {format(parseISO(session.session_time), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  {onDelete && (
                    <Button
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => handleDeleteClick(session.id)}
                      disabled={deletingSessionId === session.id}
                    >
                      {deletingSessionId === session.id ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                
                {/* Dogs in this session */}
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">Dogs:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {session.dogs?.map(dogEntry => (
                      <span 
                        key={dogEntry.id} 
                        className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5"
                      >
                        {dogEntry.dog?.name || 'Unknown dog'}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Notes section with expand/collapse */}
                {hasNotes && (
                  <div className="mt-3 border-t pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center text-sm text-muted-foreground p-0 h-auto"
                      onClick={() => toggleExpandNotes(session.id)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      <span>Observations {isExpanded ? '(click to collapse)' : '(click to expand)'}</span>
                    </Button>
                    
                    {isExpanded && (
                      <CardDescription className="whitespace-pre-wrap text-sm mt-2 p-2 bg-muted/50 rounded">
                        {session.notes}
                      </CardDescription>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              Delete Potty Break Record
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this potty break record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PottyBreakHistoryTab;
