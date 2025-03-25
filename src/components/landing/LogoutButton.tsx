
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { CustomButton } from '@/components/ui/custom-button';
import { LogOut } from 'lucide-react';
import { LogoutDialog } from '@/components/user-management/LogoutDialog';

const LogoutButton: React.FC = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      
      toast({
        title: "Success",
        description: "You have been signed out successfully.",
        variant: "default"
      });
      
      // Redirect to auth page
      navigate('/auth');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: `Failed to sign out: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSigningOut(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <>
      <CustomButton
        variant="outline"
        size="sm"
        onClick={() => setShowLogoutDialog(true)}
        icon={<LogOut size={16} />}
      >
        Sign Out
      </CustomButton>
      
      <LogoutDialog 
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleSignOut}
        isLoading={isSigningOut}
      />
    </>
  );
};

export default LogoutButton;
