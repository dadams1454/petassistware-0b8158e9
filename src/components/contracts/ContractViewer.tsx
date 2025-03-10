
import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContractById, updateContract } from '@/services/contractService';
import { Loader2, FileCheck, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import SignatureCanvas from 'react-signature-canvas';
import { generateContractHTML, downloadContract } from '@/utils/contractGenerator';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface ContractViewerProps {
  contractId: string;
}

const ContractViewer: React.FC<ContractViewerProps> = ({ contractId }) => {
  const { data: contract, isLoading } = useQuery({
    queryKey: ['contract', contractId],
    queryFn: () => getContractById(contractId),
  });

  const [breederSignature, setBreederSignature] = useState<string | null>(null);
  const [customerSignature, setCustomerSignature] = useState<string | null>(null);
  const breederSignatureRef = useRef<SignatureCanvas>(null);
  const customerSignatureRef = useRef<SignatureCanvas>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [breederData, setBreederData] = useState<any>(null);
  
  // Fetch the breeder data
  useQuery({
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
      setBreederData(data);
      return data;
    },
  });

  const updateContractMutation = useMutation({
    mutationFn: updateContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast({
        title: "Success",
        description: "Contract has been signed",
        variant: "default",
      });
    }
  });

  const clearSignature = (type: 'breeder' | 'customer') => {
    if (type === 'breeder' && breederSignatureRef.current) {
      breederSignatureRef.current.clear();
      setBreederSignature(null);
    } else if (type === 'customer' && customerSignatureRef.current) {
      customerSignatureRef.current.clear();
      setCustomerSignature(null);
    }
  };

  const saveSignature = (type: 'breeder' | 'customer') => {
    if (type === 'breeder' && breederSignatureRef.current) {
      const dataURL = breederSignatureRef.current.toDataURL('image/png');
      setBreederSignature(dataURL);
    } else if (type === 'customer' && customerSignatureRef.current) {
      const dataURL = customerSignatureRef.current.toDataURL('image/png');
      setCustomerSignature(dataURL);
    }
  };

  const handleSignContract = async () => {
    if (!contract || !breederSignature || !customerSignature) return;
    
    try {
      await updateContractMutation.mutateAsync({
        id: contract.id,
        breeder_signature: breederSignature,
        customer_signature: customerSignature,
        signed: true,
      });
    } catch (error) {
      console.error('Error signing contract:', error);
      toast({
        title: "Error",
        description: "Failed to sign the contract",
        variant: "destructive",
      });
    }
  };

  const handleDownloadContract = () => {
    if (!contract || !breederData) return;

    const contractData = {
      breederName: `${breederData.first_name || ''} ${breederData.last_name || ''}`,
      breederBusinessName: breederData.business_name || 'Not specified',
      customerName: contract.customer ? `${contract.customer.first_name} ${contract.customer.last_name}` : 'Not specified',
      puppyName: contract.puppy?.name || null,
      puppyDob: contract.puppy?.birth_date || null,
      salePrice: contract.price || null,
      contractDate: contract.contract_date,
      microchipNumber: contract.puppy?.microchip_number || null,
      breederSignature: breederSignature,
      customerSignature: customerSignature,
      signed: !!breederSignature && !!customerSignature
    };

    const contractHtml = generateContractHTML(contractData);
    const customerLastName = contract.customer?.last_name || 'Customer';
    const puppyName = contract.puppy?.name || 'Puppy';
    const filename = `${customerLastName}_${puppyName}_Contract_${format(new Date(), 'yyyyMMdd')}.html`;
    downloadContract(contractHtml, filename);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center p-6">
        <p>Contract not found</p>
      </div>
    );
  }

  const isAlreadySigned = contract.signed;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {contract.contract_type || 'Sale'} Contract
        </h2>
        <Button onClick={handleDownloadContract} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      <Card className="p-6">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <h2 className="text-xl text-center">Puppy Sale Contract</h2>
          <p className="text-center">{breederData?.business_name || 'Kennel Business'}</p>
          
          <div className="my-4">
            <p>This agreement is made on {format(new Date(contract.contract_date), 'MMMM d, yyyy')} between:</p>
            <p><strong>Seller:</strong> {breederData ? `${breederData.first_name || ''} ${breederData.last_name || ''}` : 'Breeder'} of {breederData?.business_name || 'Kennel Business'}</p>
            <p><strong>Buyer:</strong> {contract.customer ? `${contract.customer.first_name} ${contract.customer.last_name}` : 'Customer'}</p>
          </div>

          <div className="my-4">
            <h3>Puppy Information</h3>
            <p><strong>Name:</strong> {contract.puppy?.name || 'Not specified'}</p>
            <p><strong>Date of Birth:</strong> {contract.puppy?.birth_date ? format(new Date(contract.puppy.birth_date), 'MMMM d, yyyy') : 'Not specified'}</p>
            <p><strong>Microchip Number:</strong> {contract.puppy?.microchip_number || 'Not specified'}</p>
            <p><strong>Purchase Price:</strong> ${contract.price?.toFixed(2) || 'Not specified'}</p>
          </div>

          <div className="my-4">
            <h3>Terms and Conditions</h3>
            <ol className="list-decimal pl-5">
              <li>The Seller guarantees that the puppy is in good health at the time of sale.</li>
              <li>The Buyer agrees to provide proper care, including regular veterinary checkups.</li>
              <li>The Seller provides a health guarantee for genetic defects for 24 months from the date of birth.</li>
              <li>This puppy is being sold as a pet/companion animal.</li>
            </ol>
          </div>
          
          {contract.notes && (
            <div className="my-4">
              <h3>Additional Notes</h3>
              <p>{contract.notes}</p>
            </div>
          )}
        </div>
      </Card>

      {!isAlreadySigned ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Breeder Signature */}
          <Card className="p-4">
            <Label htmlFor="breeder-signature" className="mb-2 block">Breeder Signature</Label>
            <div className="border rounded-md bg-white dark:bg-slate-950 h-40">
              <SignatureCanvas
                ref={breederSignatureRef}
                canvasProps={{
                  width: 500,
                  height: 160,
                  className: 'signature-canvas w-full h-full'
                }}
                backgroundColor="transparent"
              />
            </div>
            <div className="flex justify-between mt-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => clearSignature('breeder')}
              >
                Clear
              </Button>
              <Button 
                type="button" 
                size="sm"
                onClick={() => saveSignature('breeder')}
              >
                Save Signature
              </Button>
            </div>
          </Card>

          {/* Customer Signature */}
          <Card className="p-4">
            <Label htmlFor="customer-signature" className="mb-2 block">Customer Signature</Label>
            <div className="border rounded-md bg-white dark:bg-slate-950 h-40">
              <SignatureCanvas
                ref={customerSignatureRef}
                canvasProps={{
                  width: 500,
                  height: 160,
                  className: 'signature-canvas w-full h-full'
                }}
                backgroundColor="transparent"
              />
            </div>
            <div className="flex justify-between mt-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => clearSignature('customer')}
              >
                Clear
              </Button>
              <Button 
                type="button" 
                size="sm"
                onClick={() => saveSignature('customer')}
              >
                Save Signature
              </Button>
            </div>
          </Card>

          <div className="md:col-span-2 flex justify-center">
            <Button 
              onClick={handleSignContract}
              disabled={!breederSignature || !customerSignature || updateContractMutation.isPending}
              className="w-full md:w-auto"
            >
              {updateContractMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileCheck className="h-4 w-4 mr-2" />
              )}
              Sign Contract
            </Button>
          </div>
        </div>
      ) : (
        <Card className="p-4">
          <div className="text-center text-green-600 dark:text-green-400 mb-4">
            <FileCheck className="h-8 w-8 mx-auto mb-2" />
            <p className="font-semibold">This contract has been signed</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="mb-2 block">Breeder Signature</Label>
              {contract.breeder_signature ? (
                <div className="border rounded-md bg-white p-4 dark:bg-slate-950">
                  <img src={contract.breeder_signature} alt="Breeder Signature" className="max-h-20" />
                </div>
              ) : (
                <div className="border rounded-md bg-slate-50 p-4 dark:bg-slate-900 text-center text-sm text-slate-500">
                  No signature available
                </div>
              )}
            </div>
            <div>
              <Label className="mb-2 block">Customer Signature</Label>
              {contract.customer_signature ? (
                <div className="border rounded-md bg-white p-4 dark:bg-slate-950">
                  <img src={contract.customer_signature} alt="Customer Signature" className="max-h-20" />
                </div>
              ) : (
                <div className="border rounded-md bg-slate-50 p-4 dark:bg-slate-900 text-center text-sm text-slate-500">
                  No signature available
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContractViewer;
