
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Function to sign out all users
 */
export const useAuthActions = () => {
  const { toast } = useToast();

  const signOutAllUsers = async (): Promise<void> => {
    try {
      // Sign out the current user using Supabase auth
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) throw signOutError;
      
      toast({
        title: "Success",
        description: "You have been signed out. You will be redirected to the login page.",
        variant: "default"
      });
      
      // Redirect to auth page after a short delay
      setTimeout(() => {
        window.location.href = '/auth';
      }, 1500);
      
    } catch (err: any) {
      console.error('Error signing out users:', err);
      toast({
        title: "Error",
        description: `Failed to sign out: ${err.message}`,
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    signOutAllUsers
  };
};
