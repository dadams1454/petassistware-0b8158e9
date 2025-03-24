
import React from 'react';
import { Button } from '@/components/ui/button';

interface DialogFooterButtonsProps {
  onCancel: () => void;
  isEditing: boolean;
}

const DialogFooterButtons: React.FC<DialogFooterButtonsProps> = ({ onCancel, isEditing }) => {
  return (
    <>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? 'Update Record' : 'Add Record'}
      </Button>
    </>
  );
};

export default DialogFooterButtons;
