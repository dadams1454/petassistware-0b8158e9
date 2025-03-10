
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
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
  const { data: puppy } = useQuery({
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

  const { data: customer } = useQuery({
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

  const { data: breederProfile } = useQuery({
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

  const handleGenerateContract = () => {
    if (!puppy || !customer || !breederProfile) return;

    const contractData = {
      breederName: `${breederProfile.first_name} ${breederProfile.last_name}`,
      breederBusinessName: breederProfile.business_name || 'Not specified',
      customerName: `${customer.first_name} ${customer.last_name}`,
      puppyName: puppy.name,
      puppyDob: puppy.birth_date,
      salePrice: puppy.sale_price,
      contractDate: new Date().toISOString(),
      microchipNumber: puppy.microchip_number
    };

    const contractHtml = generateContractHTML(contractData);
    const filename = `${customer.last_name}_${puppy.name || 'Puppy'}_Contract.html`;
    downloadContract(contractHtml, filename);
  };

  return (
    <Button 
      onClick={handleGenerateContract}
      className={className}
      disabled={!puppy || !customer || !breederProfile}
    >
      <FileDown className="w-4 h-4 mr-2" />
      Generate Contract
    </Button>
  );
};

export default GenerateContractButton;
