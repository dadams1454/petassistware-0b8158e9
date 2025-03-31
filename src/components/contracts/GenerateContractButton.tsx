
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { ContractData } from '@/utils/pdfGenerator';
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
  
  const getContractData = (): ContractData => {
    return {
      breederName: breederProfile ? `${breederProfile.first_name} ${breederProfile.last_name}` : '',
      breederBusinessName: breederProfile?.business_name || 'Not specified',
      customerName: customer ? `${customer.first_name} ${customer.last_name}` : '',
      puppyName: puppy?.name,
      puppyDob: puppy?.birth_date,
      salePrice: puppy?.sale_price,
      contractDate: new Date().toISOString(),
      microchipNumber: puppy?.microchip_number,
      template: 'standard'
    };
  };

  const handleOpenContractDialog = () => {
    if (!puppy || !customer || !breederProfile) {
      toast({
        title: "Missing Information",
        description: "Unable to generate contract. Some required information is missing.",
        variant: "destructive"
      });
      return;
    }
    
    setIsDialogOpen(true);
  };
  
  const handleSignContract = async (signatureData: string) => {
    try {
      // Record the contract signing in the database
      const { error } = await supabase
        .from('contracts')
        .insert({
          puppy_id: puppyId,
          customer_id: customerId,
          contract_date: new Date().toISOString(),
          signed_date: new Date().toISOString(),
          signed_by: customer?.email || 'Unknown',
          signature_data: signatureData,
          status: 'signed',
          contract_type: 'sale'
        });
        
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
      
      return true;
    } catch (error) {
      console.error('Error saving contract signature:', error);
      throw error;
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
      
      {isDialogOpen && (
        <ContractPreviewDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          contractData={getContractData()}
          onSignContract={handleSignContract}
        />
      )}
    </>
  );
};

export default GenerateContractButton;
