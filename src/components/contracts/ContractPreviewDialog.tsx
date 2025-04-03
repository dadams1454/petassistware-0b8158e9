
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getContractById, Contract } from '@/services/contractService';
import { downloadContract } from '@/utils/contracts/download';

interface ContractPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string; // Changed from contractData to contractId
}

const ContractPreviewDialog: React.FC<ContractPreviewDialogProps> = ({
  isOpen,
  onOpenChange,
  contractId
}) => {
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContract = async () => {
      if (!isOpen || !contractId) return;
      
      setLoading(true);
      try {
        const contractData = await getContractById(contractId);
        setContract(contractData);
      } catch (err) {
        console.error('Error fetching contract:', err);
        setError('Failed to load contract details');
        toast({
          title: 'Error',
          description: 'Could not load contract details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [isOpen, contractId, toast]);

  const handleDownload = async () => {
    if (!contract) return;
    
    try {
      await downloadContract(contract);
      toast({
        title: 'Contract Downloaded',
        description: 'The contract has been downloaded successfully',
      });
    } catch (err) {
      console.error('Error downloading contract:', err);
      toast({
        title: 'Download Failed',
        description: 'Failed to download the contract',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Contract Preview</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-auto p-4 border rounded-md">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading contract...</span>
            </div>
          ) : error ? (
            <div className="text-center text-destructive p-4">
              {error}
            </div>
          ) : contract ? (
            <div className="contract-preview bg-white p-8">
              <h1 className="text-2xl font-bold text-center mb-6">
                {contract.contract_type?.toUpperCase()} CONTRACT
              </h1>
              
              <div className="mb-6">
                <p className="text-sm">
                  This agreement is made on <strong>{new Date(contract.contract_date || '').toLocaleDateString()}</strong> between:
                </p>
                <p className="mt-2">
                  <strong>Breeder:</strong> {contract.breeder_id || 'Bear Paw Newfoundlands'}
                </p>
                <p className="mt-1">
                  <strong>Customer:</strong> {contract.customer ? `${contract.customer.first_name} ${contract.customer.last_name}` : 'N/A'}
                  {contract.customer?.email && ` (${contract.customer.email})`}
                </p>
              </div>
              
              {contract.puppy && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold border-b pb-1 mb-2">Puppy Information</h2>
                  <p><strong>Name:</strong> {contract.puppy.name || 'Unnamed puppy'}</p>
                  <p><strong>Color:</strong> {contract.puppy.color || 'N/A'}</p>
                  <p><strong>Birth Date:</strong> {contract.puppy.birth_date ? new Date(contract.puppy.birth_date).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Microchip:</strong> {contract.puppy.microchip_number || 'Not microchipped'}</p>
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-1 mb-2">Contract Terms</h2>
                <p><strong>Price:</strong> ${contract.price || 'Not specified'}</p>
                <p><strong>Contract Type:</strong> {contract.contract_type || 'Standard'}</p>
                <p><strong>Status:</strong> {contract.status || 'Draft'}</p>
                
                {contract.notes && (
                  <div className="mt-4">
                    <h3 className="font-medium">Additional Notes:</h3>
                    <p className="text-sm whitespace-pre-line">{contract.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-12 border-t pt-4">
                <div className="flex justify-between">
                  <div className="text-center">
                    <div className="border-t border-black w-40 pt-1">Breeder Signature</div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-black w-40 pt-1">Customer Signature</div>
                    {contract.signed && contract.signed_date && (
                      <p className="text-xs mt-1">Signed on {new Date(contract.signed_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-4">
              No contract data available
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            className="mr-2" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button 
            onClick={handleDownload} 
            disabled={!contract || loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractPreviewDialog;
