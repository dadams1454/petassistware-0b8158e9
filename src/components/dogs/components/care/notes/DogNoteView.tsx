
import React from 'react';
import { format, parseISO } from 'date-fns';
import { StickyNote, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DogNoteViewProps {
  noteId: string;
  title?: string;
  content: string;
  timestamp: string;
  staffName?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DogNoteView: React.FC<DogNoteViewProps> = ({
  noteId,
  title,
  content,
  timestamp,
  staffName,
  onEdit,
  onDelete
}) => {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const formattedDate = format(parseISO(timestamp), 'MMM d, yyyy h:mm a');
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('daily_care_logs')
        .delete()
        .eq('id', noteId);
        
      if (error) throw error;
      
      toast({
        title: 'Note Deleted',
        description: 'The note has been deleted successfully.'
      });
      
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {title || 'Note'}
          </h3>
        </div>
        
        <div className="flex gap-1">
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="mb-2 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
        {content}
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
        <span>{formattedDate}</span>
        {staffName && <span>By: {staffName}</span>}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DogNoteView;
