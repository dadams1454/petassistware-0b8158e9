
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InviteForm, InviteFormValues } from './components/InviteForm';
import { InviteLinkDisplay } from './components/InviteLinkDisplay';

interface InviteUserDialogProps {
  open: boolean;
  onClose: () => void;
  onUserInvited: () => void;
}

export const InviteUserDialog: React.FC<InviteUserDialogProps> = ({
  open,
  onClose,
  onUserInvited,
}) => {
  const { tenantId } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const handleInvite = async (values: InviteFormValues) => {
    if (!tenantId) {
      toast({
        title: 'Error',
        description: 'Your organization information is missing',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real implementation, we would send an email invitation
      // For now, we'll create a breeder_profile entry for the user
      // and generate an invite link they can use to sign up

      // First, check if the user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('breeder_profiles')
        .select('id')
        .eq('email', values.email)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUser) {
        toast({
          title: 'User already exists',
          description: 'This email is already registered in the system',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Generate a unique token for the invitation
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // This is mock functionality since we don't have a proper invitation system
      // In a real app, we'd store this in a table and send an email
      const inviteUrl = `${window.location.origin}/auth?email=${encodeURIComponent(values.email)}&token=${token}&role=${values.role}&tenant=${tenantId}`;
      
      setInviteLink(inviteUrl);
      onUserInvited();
    } catch (error: any) {
      console.error('Error inviting user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send invitation',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setInviteLink(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization with specific permissions.
          </DialogDescription>
        </DialogHeader>

        {!inviteLink ? (
          <InviteForm 
            onSubmit={handleInvite} 
            isSubmitting={isSubmitting}
            onCancel={handleCloseDialog}
          />
        ) : (
          <InviteLinkDisplay 
            inviteLink={inviteLink}
            onClose={handleCloseDialog}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
