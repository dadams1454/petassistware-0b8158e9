
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

  // Generate a random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

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
      
      // Generate a password if needed
      const password = values.generateRandomPassword ? generatePassword() : '';
      
      // Create a mock user (since this is for testing)
      if (values.isTestUser) {
        const mockUserId = crypto.randomUUID();
        
        // Create a profile for the test user
        const { error: profileError } = await supabase
          .from('breeder_profiles')
          .insert({
            id: mockUserId,
            email: values.email,
            first_name: values.firstName,
            last_name: values.lastName,
            role: values.role,
            tenant_id: tenantId,
            created_at: new Date().toISOString(),
          });
          
        if (profileError) throw profileError;
        
        toast({
          title: 'Test User Created',
          description: `${values.firstName} ${values.lastName} has been added as a ${values.role}`,
          variant: 'default',
        });
        
        onUserInvited();
        setInviteLink(null);
        onClose();
        return;
      }
      
      // For real users, this is where we'd integrate with auth system
      // For now, generate a mock invitation link
      const inviteUrl = `${window.location.origin}/auth?email=${encodeURIComponent(values.email)}&token=${token}&role=${values.role}&tenant=${tenantId}`;
      
      if (values.generateRandomPassword) {
        inviteUrl += `&password=${encodeURIComponent(password)}`;
      }
      
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
