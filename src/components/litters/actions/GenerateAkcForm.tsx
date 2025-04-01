
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { generateAkcRegistrationPdf } from '@/services/akcRegistrationService';
import { downloadPdf } from '@/utils/pdfGenerator';

interface GenerateAkcFormProps {
  litterId: string;
  litterName?: string;
}

export const GenerateAkcForm: React.FC<GenerateAkcFormProps> = ({ 
  litterId,
  litterName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateAkcForm = async () => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generateAkcRegistrationPdf(litterId);
      
      if (!pdfBytes) {
        throw new Error('Failed to generate AKC registration form');
      }
      
      // Create a blob URL for preview
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
      
      toast({
        title: "AKC Form Generated",
        description: "The AKC registration form has been successfully generated.",
      });
    } catch (error) {
      console.error('Error generating AKC form:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate the AKC registration form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generateAkcRegistrationPdf(litterId);
      
      if (!pdfBytes) {
        throw new Error('Failed to generate AKC registration form');
      }
      
      // Download the PDF
      const fileName = `AKC_Registration_${litterName || litterId}.pdf`;
      downloadPdf(pdfBytes, fileName);
      
      toast({
        title: "Download Started",
        description: "Your AKC registration form is downloading.",
      });
    } catch (error) {
      console.error('Error downloading AKC form:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the AKC registration form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        AKC Registration
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">AKC Litter Registration Form</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 min-h-0 overflow-auto">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-10">
                <Spinner size="lg" />
                <p className="mt-4 text-muted-foreground">Generating AKC registration form...</p>
              </div>
            ) : pdfPreviewUrl ? (
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-[60vh] border rounded-md"
                title="AKC Registration Form Preview"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">AKC Registration Form Preview</h3>
                <p className="text-muted-foreground mb-6">
                  Generate a preview of the AKC litter registration form using data from this litter.
                </p>
                <Button onClick={generateAkcForm}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Preview
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={handleDownload}
              disabled={isGenerating} 
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
