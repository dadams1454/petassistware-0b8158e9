
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { generateContractHTML, downloadContract } from '@/utils/contractGenerator';
import { supabase } from '@/integrations/supabase/client';

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
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  const { data: puppy, isLoading: isPuppyLoading } = useQuery({
    queryKey: ['puppy', puppyId],
    queryFn: async () => {
      if (!puppyId) return null;
      
      const { data, error } = await supabase
        .from('puppies')
        .select('*, litters(*)')
        .eq('id', puppyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!puppyId
  });

  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      if (!customerId) return null;
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!customerId
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

  const handleGenerateContract = async () => {
    if (!puppy || !customer || !breederProfile) return;
    
    setIsGenerating(true);
    
    try {
      const contractData = {
        breederName: `${breederProfile.first_name} ${breederProfile.last_name}`,
        breederBusinessName: breederProfile.business_name || 'Not specified',
        customerName: `${customer.first_name} ${customer.last_name}`,
        puppyName: puppy.name,
        puppyDob: puppy.birth_date,
        salePrice: puppy.sale_price,
        contractDate: new Date().toISOString(),
        microchipNumber: puppy.microchip_number,
        paymentTerms: "Full payment due at pickup"
      };

      const contractHtml = generateContractHTML(contractData);
      const filename = `${customer.last_name}_${puppy.name || 'Puppy'}_Contract.html`;
      downloadContract(contractHtml, filename);
    } catch (error) {
      console.error('Error generating contract:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isLoading = isPuppyLoading || isCustomerLoading || isBreederLoading || isGenerating;
  const isDisabled = !puppy || !customer || !breederProfile || isLoading;

  return (
    <Button 
      onClick={handleGenerateContract}
      className={className}
      disabled={isDisabled}
      variant="outline"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="w-4 h-4 mr-2" />
      )}
      Download Contract
    </Button>
  );
};

export default GenerateContractButton;
