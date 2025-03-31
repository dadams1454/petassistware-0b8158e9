
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
import { FileText, Download, Check } from 'lucide-react';
import { ContractData, generatePdfContract, downloadPdf } from '@/utils/pdfGenerator';
import ESignatureCanvas from './ESignatureCanvas';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

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
            {isGeneratingPdf ? (
              <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <Skeleton className="h-[60vh] w-full" />
              </div>
            ) : !pdfUrl ? (
              <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <FileText className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Failed to generate preview</p>
              </div>
            ) : (
              <iframe 
                src={pdfUrl} 
                className="w-full h-[60vh] border border-gray-200 rounded-md"
                title="Contract Preview"
              />
            )}
            
            <div className="mt-4">
              <Button onClick={handleDownload} disabled={!pdfBytes}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sign" className="flex-1 overflow-auto space-y-4">
            <div className="space-y-4">
              <p>Please sign below to indicate your agreement to the terms of this contract:</p>
              
              <div className="border rounded-md p-4 bg-gray-50">
                <p className="text-sm font-medium">Signing as: {contractData.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  Date: {new Date().toLocaleDateString()}
                </p>
              </div>
              
              <ESignatureCanvas 
                onChange={setSignature}
                width={600}
                height={200}
              />
              
              <p className="text-sm text-muted-foreground">
                By signing, you acknowledge that you have read and agree to all terms and conditions outlined in this contract.
              </p>
            </div>
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
