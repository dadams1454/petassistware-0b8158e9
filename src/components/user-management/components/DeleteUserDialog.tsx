
import React from 'react';
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
import { UserWithProfile } from '@/types/user';

interface DeleteUserDialogProps {
  user: UserWithProfile | null;
  onClose: () => void;
  onConfirm: (userId: string) => void;
}

export function DeleteUserDialog({ user, onClose, onConfirm }: DeleteUserDialogProps) {
  if (!user) return null;

  const handleConfirm = () => {
    onConfirm(user.id);
  };

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email;

  return (
    <AlertDialog open={!!user} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will deactivate the user <strong>{fullName}</strong> from your organization.
            <br /><br />
            They will no longer have access to your organization's data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground">
            Deactivate User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
