
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DogProfile } from '@/types/dog';

interface NotesTabProps {
  dogId: string;
  initialNotes?: string;
  dog?: DogProfile;
}

const NotesTab: React.FC<NotesTabProps> = ({ dogId, initialNotes = '', dog }) => {
  const [notes, setNotes] = useState(initialNotes || (dog?.notes || ''));
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveNotes = async () => {
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('dogs')
        .update({ notes })
        .eq('id', dogId);
      
      if (error) throw error;
      
      toast({
        title: 'Notes saved',
        description: 'Your notes have been saved successfully',
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Error saving notes',
        description: 'There was a problem saving your notes',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this dog..."
          className="min-h-[200px] mb-4"
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveNotes}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Notes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesTab;
