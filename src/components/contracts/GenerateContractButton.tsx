
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ContractPreviewDialog from './ContractPreviewDialog';
import { useToast } from '@/hooks/use-toast';

interface GenerateContractButtonProps {
  puppyId: string;
  customerId: string;
  className?: string;
}

const GenerateContractButton: React.FC<GenerateContractButtonProps> = ({ 
  puppyId, 
  customerId,
  className 
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedContractId, setGeneratedContractId] = useState<string | null>(null);
  
  const { data: puppy, isLoading: isPuppyLoading } = useQuery({
    queryKey: ['puppy', puppyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puppies')
        .select('*, litters(*)')
        .eq('id', puppyId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: breederProfile, isLoading: isBreederLoading } = useQuery({
    queryKey: ['breederProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('breeder_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const isLoading = isPuppyLoading || isCustomerLoading || isBreederLoading;
  
  const handleOpenContractDialog = async () => {
    if (!puppy || !customer || !breederProfile) {
      toast({
        title: "Missing Information",
        description: "Unable to generate contract. Some required information is missing.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Generate a new contract in the database
      const { data, error } = await supabase
        .from('contracts')
        .insert({
          puppy_id: puppyId,
          customer_id: customerId,
          contract_date: new Date().toISOString(),
          price: puppy.sale_price,
          status: 'draft',
          contract_type: 'sale'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Set the generated contract ID and open the dialog
      setGeneratedContractId(data.id);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error generating contract:', error);
      toast({
        title: "Error",
        description: "Failed to generate contract. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSignContract = async (signatureData: string): Promise<void> => {
    if (!generatedContractId) return;
    
    try {
      // Record the contract signing in the database
      const { error } = await supabase
        .from('contracts')
        .update({
          signed: true,
          signed_date: new Date().toISOString(),
          status: 'signed'
        })
        .eq('id', generatedContractId);
        
      if (error) throw error;
      
      // Update the reservation if it exists
      const { data: reservations } = await supabase
        .from('reservations')
        .select('id')
        .eq('puppy_id', puppyId)
        .eq('customer_id', customerId)
        .limit(1);
        
      if (reservations && reservations.length > 0) {
        await supabase
          .from('reservations')
          .update({
            contract_signed: true,
            contract_date: new Date().toISOString(),
            status: 'Contract Signed'
          })
          .eq('id', reservations[0].id);
      }
      
      toast({
        title: "Contract Signed",
        description: "Contract has been successfully signed and recorded."
      });
    } catch (error) {
      console.error('Error saving contract signature:', error);
      toast({
        title: "Error",
        description: "Failed to sign contract. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Button 
        onClick={handleOpenContractDialog}
        className={className}
        disabled={isLoading}
      >
        <FileText className="w-4 h-4 mr-2" />
        Generate Contract
      </Button>
      
      {isDialogOpen && generatedContractId && (
        <ContractPreviewDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          contractId={generatedContractId}
          onSignContract={handleSignContract}
        />
      )}
    </>
  );
};

export default GenerateContractButton;
