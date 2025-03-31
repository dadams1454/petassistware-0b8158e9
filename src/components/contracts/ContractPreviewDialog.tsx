
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check } from 'lucide-react';
import { ContractData, generatePdfContract, downloadPdf } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import PreviewTab from './tabs/PreviewTab';
import SignatureTab from './tabs/SignatureTab';

interface ContractPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contractData: ContractData;
  onSignContract: (signatureData: string) => Promise<void>;
}

const ContractPreviewDialog: React.FC<ContractPreviewDialogProps> = ({
  isOpen,
  onOpenChange,
  contractData,
  onSignContract,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('preview');
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(true);
  const [isSigningContract, setIsSigningContract] = useState(false);

  // Generate PDF preview when dialog opens or contract data changes
  useEffect(() => {
    if (!isOpen) return;

    const generatePreview = async () => {
      setIsGeneratingPdf(true);
      try {
        const bytes = await generatePdfContract(contractData);
        setPdfBytes(bytes);
        
        // Create a blob URL for the preview
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error generating PDF preview:', error);
        toast({
          title: 'Error',
          description: 'Failed to generate contract preview',
          variant: 'destructive'
        });
      } finally {
        setIsGeneratingPdf(false);
      }
    };

    generatePreview();

    // Clean up blob URL on unmount
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [isOpen, contractData, toast]);

  const handleDownload = () => {
    if (!pdfBytes) return;
    
    const customerName = contractData.customerName.split(' ').pop() || 'Customer';
    const puppyName = contractData.puppyName || 'Puppy';
    const filename = `${customerName}_${puppyName}_Contract.pdf`;
    
    downloadPdf(pdfBytes, filename);
    
    toast({
      title: 'Download Started',
      description: 'Your contract is downloading',
    });
  };

  const handleSignContract = async () => {
    if (!signature) {
      toast({
        title: 'Signature Required',
        description: 'Please sign the contract before submitting',
        variant: 'destructive'
      });
      return;
    }

    setIsSigningContract(true);
    try {
      await onSignContract(signature);
      toast({
        title: 'Contract Signed',
        description: 'The contract has been successfully signed'
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error signing contract:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign the contract',
        variant: 'destructive'
      });
    } finally {
      setIsSigningContract(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Contract Preview & Signature</DialogTitle>
        </DialogHeader>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="preview">Preview Contract</TabsTrigger>
            <TabsTrigger value="sign">Sign Contract</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 overflow-hidden flex flex-col">
            <PreviewTab
              isGeneratingPdf={isGeneratingPdf}
              pdfUrl={pdfUrl}
              pdfBytes={pdfBytes}
              onDownload={handleDownload}
            />
          </TabsContent>

          <TabsContent value="sign" className="flex-1 overflow-auto space-y-4">
            <SignatureTab
              customerName={contractData.customerName}
              onSignatureChange={setSignature}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          {activeTab === 'sign' && (
            <Button 
              onClick={handleSignContract} 
              disabled={!signature || isSigningContract}
            >
              {isSigningContract ? (
                <>Signing...</>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Sign Contract
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContractPreviewDialog;
