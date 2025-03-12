
import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Upload, Scan, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface PedigreeScanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPedigreeExtracted: (pedigreeData: any) => void;
}

const PedigreeScanDialog = ({ isOpen, onClose, onPedigreeExtracted }: PedigreeScanDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG)',
        variant: 'destructive',
      });
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!previewUrl) return;

    setIsProcessing(true);
    setProgress(0);
    setExtractedText('');

    try {
      // Initialize Tesseract worker
      const worker = await createWorker({
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      // Set worker language
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      // Recognize text
      const { data } = await worker.recognize(previewUrl);
      
      // Terminate worker
      await worker.terminate();

      // Set extracted text
      setExtractedText(data.text);
      
      // Process the extracted text to find dog information
      const processedData = processPedigreeText(data.text);
      
      // Notify parent component
      onPedigreeExtracted(processedData);
      
      toast({
        title: 'Pedigree scanned successfully',
        description: 'Information has been extracted from the pedigree document',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: 'Processing failed',
        description: 'Failed to extract information from the image',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  // Process the extracted text to find relevant dog information
  const processPedigreeText = (text: string): any => {
    // This is a simple implementation - in a real app this would be more sophisticated
    const dogData: any = {};
    
    // Look for common pedigree information
    const nameMatch = text.match(/name[:\s]+([^\n]+)/i);
    const breedMatch = text.match(/breed[:\s]+([^\n]+)/i);
    const regMatch = text.match(/reg(?:istration)?(?:\s+no)?(?:\.)?\s*[:#]?\s*([A-Z0-9\-]+)/i);
    const dobMatch = text.match(/(?:date of birth|born|dob)[:\s]+([^\n]+)/i);
    const colorMatch = text.match(/colou?r[:\s]+([^\n]+)/i);
    const sireMatch = text.match(/sire[:\s]+([^\n]+)/i);
    const damMatch = text.match(/dam[:\s]+([^\n]+)/i);
    
    if (nameMatch && nameMatch[1]) dogData.name = nameMatch[1].trim();
    if (breedMatch && breedMatch[1]) dogData.breed = breedMatch[1].trim();
    if (regMatch && regMatch[1]) dogData.registration_number = regMatch[1].trim();
    if (dobMatch && dobMatch[1]) dogData.birthdate = dobMatch[1].trim();
    if (colorMatch && colorMatch[1]) dogData.color = colorMatch[1].trim();
    if (sireMatch && sireMatch[1]) dogData.sire = sireMatch[1].trim();
    if (damMatch && damMatch[1]) dogData.dam = damMatch[1].trim();
    
    return dogData;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Scan Pedigree Document
          </DialogTitle>
          <DialogDescription>
            Upload a clear image of a pedigree document to extract dog information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!previewUrl ? (
            <div 
              className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => document.getElementById('pedigree-upload')?.click()}
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-1">Click to upload</p>
              <p className="text-xs text-muted-foreground mb-4">or drag and drop</p>
              <Input 
                id="pedigree-upload"
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading || isProcessing}
              />
              <Button 
                variant="outline" 
                size="sm"
                disabled={isUploading || isProcessing}
              >
                Select Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-md overflow-hidden border">
                <img 
                  src={previewUrl} 
                  alt="Pedigree document" 
                  className="object-contain w-full h-full"
                />
              </div>
              
              {isProcessing && (
                <div className="space-y-2">
                  <p className="text-sm text-center">Processing image...</p>
                  <Progress value={progress} />
                </div>
              )}
              
              {extractedText && (
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                  <p className="text-xs font-mono whitespace-pre-wrap">{extractedText}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setPreviewUrl(null);
                    setExtractedText('');
                  }}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Change Image
                </Button>
                <Button 
                  className="flex-1"
                  onClick={processImage}
                  disabled={isProcessing || !previewUrl}
                >
                  {isProcessing ? 'Processing...' : 'Extract Information'}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3 mr-1" />
            For best results, use a clear image
          </div>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PedigreeScanDialog;
