import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/AuthProvider';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const AdminSetup: React.FC = () => {
  const { user } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tenantName, setTenantName] = useState('');
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSetup = async () => {
      setIsLoading(true);
      try {
        // Check if the user has a breeder profile
        const { data: profile, error: profileError } = await supabase
          .from('breeder_profiles')
          .select('id')
          .eq('id', user?.id)
          .single();

        if (profileError) {
          console.error('Error checking breeder profile:', profileError);
          throw profileError;
        }

        setIsSetupComplete(!!profile);
        if (!!profile) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error during setup check:', error);
        toast({
          title: 'Error',
          description: 'Failed to check setup status. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      checkSetup();
    }
  }, [user, navigate]);

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isTermsChecked) {
      toast({
        title: 'Terms not accepted',
        description: 'Please accept the terms and conditions to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create a new breeder profile
      const { error: insertError } = await supabase
        .from('breeder_profiles')
        .insert([{
          id: user?.id,
          tenant_name: tenantName,
        }]);

      if (insertError) {
        console.error('Error creating breeder profile:', insertError);
        throw insertError;
      }

      toast({
        title: 'Setup Complete',
        description: 'Your account has been successfully set up.',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during setup:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete setup. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (isSetupComplete) {
    return <div className="text-center">Setup complete. Redirecting to dashboard...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Account Setup</CardTitle>
          <CardDescription className="text-center">
            Complete the setup to start managing your breeding operations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetupSubmit} className="space-y-6">
            <div>
              <Label htmlFor="tenantName">Organization Name</Label>
              <Input
                type="text"
                id="tenantName"
                placeholder="Enter your organization name"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={isTermsChecked}
                  onCheckedChange={(checked) => setIsTermsChecked(!!checked)}
                />
                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                  I agree to the <a href="#" className="text-blue-500">terms and conditions</a>
                </Label>
              </div>
            </div>
            <Button disabled={isLoading} className="w-full">
              Complete Setup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
