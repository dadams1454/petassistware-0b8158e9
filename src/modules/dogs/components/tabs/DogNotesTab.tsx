
import React, { useState } from 'react';
import { useDogData } from '../../hooks/useDogData';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { DogProfile } from '../../types/dog';

interface DogNotesTabProps {
  dog: DogProfile;
  dogId: string;
}

const DogNotesTab: React.FC<DogNotesTabProps> = ({ dog, dogId }) => {
  const [notes, setNotes] = useState(dog.notes || '');
  const [isEditing, setIsEditing] = useState(false);
  const { updateDog, isUpdating } = useDogData(dogId);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    updateDog({ notes });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setNotes(dog.notes || '');
    setIsEditing(false);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {isEditing ? (
          <>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this dog..."
              className="min-h-[200px] mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancelClick}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveClick}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>
          </>
        ) : (
          <>
            {notes ? (
              <div className="mb-4">
                <p className="whitespace-pre-line">{notes}</p>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No notes have been added for this dog.</p>
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={handleEditClick}>
                {notes ? 'Edit Notes' : 'Add Notes'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DogNotesTab;
