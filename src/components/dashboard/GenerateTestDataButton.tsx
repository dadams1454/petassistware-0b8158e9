
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { generateTestData } from '@/utils/testDataGenerator';
import { useToast } from '@/components/ui/use-toast';
import { useRefreshData } from '@/hooks/useRefreshData';

const GenerateTestDataButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const refreshData = useRefreshData();

  const handleGenerateTestData = async () => {
    setIsLoading(true);
    try {
      const result = await generateTestData();
      
      if (result.success) {
        toast({
          title: 'Test Data Generated',
          description: `Created ${result.dogIds?.length || 0} dogs, ${result.customerIds?.length || 0} customers, and sample records.`,
          variant: 'default'
        });
        
        // Refresh all data to show the new records
        if (typeof refreshData === 'function') {
          refreshData();
        }
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
      Generate Test Data
    </Button>
  );
};

export default GenerateTestDataButton;
