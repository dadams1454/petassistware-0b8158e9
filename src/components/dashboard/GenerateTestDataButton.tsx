
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { generateTestCareData } from '@/utils/generateTestCareData';
import { useToast } from '@/hooks/use-toast';
import { useRefreshTrigger } from '@/hooks/useRefreshData';
import { useAuth } from '@/contexts/AuthProvider';

const GenerateTestDataButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const refreshData = useRefreshTrigger();
  const { user } = useAuth();

  const handleGenerateTestData = async () => {
    if (!user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to generate test data.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await generateTestCareData(user.id);
      
      if (result.success) {
        toast({
          title: 'Test Data Generated',
          description: result.message,
          variant: 'default'
        });
        
        // Refresh all data to show the new records
        refreshData(true);
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to generate test data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGenerateTestData}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      Generate Test Care Data
    </Button>
  );
};

export default GenerateTestDataButton;
