
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StickyNote, Save, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface DogNotesFormProps {
  dogId: string;
  dogName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  existingNote?: {
    id: string;
    content: string;
    title: string;
  };
}

const DogNotesForm: React.FC<DogNotesFormProps> = ({
  dogId,
  dogName,
  onSuccess,
  onCancel,
  existingNote
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [noteTitle, setNoteTitle] = useState(existingNote?.title || '');
  const [noteContent, setNoteContent] = useState(existingNote?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!noteContent.trim()) {
      setError('Note content cannot be empty');
      return;
    }
    
    if (!user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to save notes',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create or update the note in the daily_dog_notes table
      const noteData = {
        dog_id: dogId,
        staff_id: user.id,
        title: noteTitle.trim() || `Note for ${dogName}`,
        content: noteContent,
        created_at: new Date().toISOString(),
        category: 'daily_note'
      };
      
      let result;
      
      if (existingNote?.id) {
        // Update existing note
        result = await supabase
          .from('daily_care_logs')
          .update({
            notes: noteContent,
            title: noteTitle.trim() || `Note for ${dogName}`
          })
          .eq('id', existingNote.id);
      } else {
        // Create new note
        result = await supabase
          .from('daily_care_logs')
          .insert({
            ...noteData,
            activity_type: 'note',
            category: 'notes'
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: 'Note Saved',
        description: `Note for ${dogName} has been saved successfully.`
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to save note',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="noteTitle">Title (Optional)</Label>
        <Input
          id="noteTitle"
          placeholder={`Note for ${dogName}`}
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="noteContent">Note Content</Label>
        <Textarea
          id="noteContent"
          placeholder={`Enter your observations or notes about ${dogName}...`}
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          rows={6}
          className="min-h-[150px]"
        />
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        
        <Button 
          type="submit" 
          disabled={isSubmitting || !noteContent.trim()}
          className="gap-1"
        >
          <StickyNote className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : existingNote ? 'Update Note' : 'Save Note'}
        </Button>
      </div>
    </form>
  );
};

export default DogNotesForm;
